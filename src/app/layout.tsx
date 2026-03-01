import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,      // prevents iOS auto-zoom on input focus
  userScalable: false,
  themeColor: "#6366f1",
  viewportFit: "cover", // content can extend behind iOS notch
};

export const metadata: Metadata = {
  title: "SpeakSharp | Executive Communication Coach",
  description:
    "Prepare for Director and VP roles at Google, Amazon, Microsoft, Meta, and Apple. Master executive communication, FAANG interview prep, and leadership storytelling.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SpeakSharp",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/icons/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
