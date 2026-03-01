import Anthropic from "@anthropic-ai/sdk";
import "server-only";

// Lazy singleton — created on first use so process.env is read at
// request time, not at module-evaluation time (avoids Turbopack cache issues).
let _client: Anthropic | undefined;

export function getAnthropicClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your .env.local file."
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

// Convenience re-export so existing callers using `anthropic.messages.create`
// can do: import { anthropic } from "@/lib/anthropic"
// The Proxy forwards every property access to the lazy client.
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    return (getAnthropicClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
