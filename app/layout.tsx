import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelMusic — Lossless Sound Made Effortlessly | Android",
  description:
    "An open-source, ad-free Android music player with Material 3 Expressive UI, hybrid local/YouTube Music playback, and bit-perfect lossless audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full bg-[#3a6073] text-white antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Big+Shoulders+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="h-full w-full overflow-hidden font-outfit select-none">
        {children}
      </body>
    </html>
  );
}
