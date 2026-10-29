import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Exam Study Buddy",
    short_name: "Study Buddy",
    description: "Term 1 exam practice for Grade 3/4.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f6f7f9",
    theme_color: "#2f5bd3",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
