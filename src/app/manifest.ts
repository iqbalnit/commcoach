import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SpeakSharp | Executive Communication Coach",
    short_name: "SpeakSharp",
    description:
      "Prepare for Director and VP roles at FAANG. Master executive communication, interview prep, and leadership storytelling.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1e",
    theme_color: "#6366f1",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
