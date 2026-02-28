"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface VoiceSessionMetrics {
  finalTranscript: string;
  fillerWordsDetected: string[];
  wpm: number;
  speakingFraction: number;
  volumeLevel: number;
  durationSeconds: number;
}

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "sort of", "kind of"];
const FILLER_REGEX = /\b(um|uh|like|you know|basically|sort of|kind of)\b/gi;

// Graceful type declarations for browser Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useVoiceAnalysis() {
  // Evaluate after mount so SSR (window=undefined) doesn't lock this to false
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [fillerWordsDetected, setFillerWordsDetected] = useState<string[]>([]);
  const [wpm, setWpm] = useState(0);
  const [speakingFraction, setSpeakingFraction] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const speakingTimeRef = useRef<number>(0);
  const lastSpeakingRef = useRef<boolean>(false);
  const finalTextRef = useRef<string>("");

  const trackVolume = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const normalized = Math.min(avg / 128, 1);
    setVolumeLevel(normalized);

    const isSpeaking = normalized > 0.05;
    if (isSpeaking && !lastSpeakingRef.current) {
      lastSpeakingRef.current = true;
    } else if (!isSpeaking && lastSpeakingRef.current) {
      lastSpeakingRef.current = false;
      speakingTimeRef.current += 0.1;
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed > 0) {
      setSpeakingFraction(speakingTimeRef.current / elapsed);
    }

    animFrameRef.current = requestAnimationFrame(trackVolume);
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) return;

    // Always clear any previous permission error before attempting
    setPermissionDenied(false);

    const SpeechRecognitionClass = getSpeechRecognition()!;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio analysis
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Speech recognition
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += t + " ";
          } else {
            interim += t;
          }
        }

        if (final) {
          finalTextRef.current += final;
          setFinalTranscript(finalTextRef.current.trim());

          // Detect filler words
          const matches = (finalTextRef.current.match(FILLER_REGEX) || []).map((w) =>
            w.toLowerCase()
          );
          setFillerWordsDetected([...new Set(matches)]);

          // WPM calculation
          const words = finalTextRef.current.trim().split(/\s+/).filter(Boolean).length;
          const elapsed = (Date.now() - startTimeRef.current) / 60000;
          if (elapsed > 0) setWpm(Math.round(words / elapsed));
        }

        setLiveTranscript(finalTextRef.current + interim);
      };

      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        // Only treat genuine permission errors as denied — ignore "aborted", "no-speech", etc.
        if (e.error === "not-allowed" || e.error === "permission-denied") {
          setPermissionDenied(true);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      startTimeRef.current = Date.now();
      speakingTimeRef.current = 0;
      finalTextRef.current = "";
      setFinalTranscript("");
      setLiveTranscript("");
      setFillerWordsDetected([]);
      setWpm(0);
      setSpeakingFraction(0);
      setIsRecording(true);

      trackVolume();
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setPermissionDenied(true);
      }
    }
  }, [isSupported, trackVolume]);

  const stopRecording = useCallback((): VoiceSessionMetrics => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    cancelAnimationFrame(animFrameRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    setIsRecording(false);
    setVolumeLevel(0);

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const words = finalTextRef.current.trim().split(/\s+/).filter(Boolean).length;
    const wpmFinal = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
    const fillers = (finalTextRef.current.match(FILLER_REGEX) || []).map((w) =>
      w.toLowerCase()
    );

    return {
      finalTranscript: finalTextRef.current.trim(),
      fillerWordsDetected: [...new Set(fillers)],
      wpm: wpmFinal,
      speakingFraction: speakingTimeRef.current / Math.max(elapsed, 1),
      volumeLevel: 0,
      durationSeconds: Math.round(elapsed),
    };
  }, []);

  const resetMetrics = useCallback(() => {
    finalTextRef.current = "";
    setFinalTranscript("");
    setLiveTranscript("");
    setFillerWordsDetected([]);
    setWpm(0);
    setSpeakingFraction(0);
    setVolumeLevel(0);
  }, []);

  const resetPermission = useCallback(() => {
    setPermissionDenied(false);
  }, []);

  useEffect(() => {
    return () => {
      if (isRecording) stopRecording();
    };
  }, [isRecording, stopRecording]);

  return {
    isSupported,
    isRecording,
    permissionDenied,
    liveTranscript,
    finalTranscript,
    fillerWordsDetected,
    wpm,
    speakingFraction,
    volumeLevel,
    startRecording,
    stopRecording,
    resetMetrics,
    resetPermission,
  };
}

export { FILLER_WORDS };
