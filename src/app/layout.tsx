import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "SpeakSharp | Executive Communication Coach",
  description:
    "Prepare for Director and VP roles at Google, Amazon, Microsoft, Meta, and Apple. Master executive communication, FAANG interview prep, and leadership storytelling.",
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
