"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "features", label: "Features", href: "https://github.com/ianshulyadav/PixelMusic#features" },
  { id: "audio", label: "Audio Engine", href: "https://github.com/ianshulyadav/PixelMusic#audio-engine" },
  { id: "changelog", label: "Changelog", href: "https://github.com/ianshulyadav/PixelMusic/releases" },
  { id: "github", label: "GitHub", href: "https://github.com/ianshulyadav/PixelMusic" },
];

export default function Home() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [pageRevealed, setPageRevealed] = useState(false);
  const [curtainRemoved, setCurtainRemoved] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Smooth sliding water-pill state for navbar with cubic-bezier transition
  const [activeNav, setActiveNav] = useState("features");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 6, width: 80, opacity: 1 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Prompt, lag-free Sundown page entry effect on mount
  useEffect(() => {
    // Start reveal immediately on mount
    const revealTimer = setTimeout(() => {
      setPageRevealed(true);
    }, 40);

    // Completely unmount curtain after transition finishes
    const cleanupTimer = setTimeout(() => {
      setCurtainRemoved(true);
    }, 950);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  // Background Audio handling (Golden Brown.mp3)
  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    // Autoplay on first click anywhere (browser policy compliance)
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  const toggleBgAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = bgAudioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  // Recalculate water-shaped pill position on hover, switch, or resize
  const moveIndicator = (id: string) => {
    const el = navItemRefs.current[id];
    const parent = navContainerRef.current;
    if (el && parent) {
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - parentRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      moveIndicator(activeNav);
    }, 100);

    const handleResize = () => moveIndicator(activeNav);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeNav]);

  // Smooth video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.95;
    }
  }, []);

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText("e8a4d70c91b5c3e08210fe9132d40902bbff289c4176d65313a52140ab508b04");
    setCopiedChecksum(true);
    setTimeout(() => setCopiedChecksum(false), 2500);
  };

  return (
    <main className="relative h-[100dvh] w-[100dvw] max-h-[100dvh] max-w-[100dvw] overflow-hidden text-white select-none flex flex-col justify-between py-2 sm:py-3 px-5 sm:px-8 md:px-12 bg-[#08090c]">
      {/* 
        ========================================================================
        FULL-COVERAGE SUNDOWN ENTRY CURTAIN REVEAL (NO CORNER PEAKS/GAPS)
        ========================================================================
      */}
      {!curtainRemoved && (
        <div
          className={`sundown-curtain-wrapper ${pageRevealed ? "revealed" : ""}`}
          aria-hidden="true"
        />
      )}

      {/* 
        ========================================================================
        BACKGROUND AUDIO ELEMENT (Golden Brown.mp3)
        ========================================================================
      */}
      <audio ref={bgAudioRef} src="/assets/bg-song.mp3" loop preload="auto" />

      {/* 
        ========================================================================
        SMOOTH LOOP BACKGROUND VIDEO (BRIGHT, LUMINOUS & FULLY VISIBLE)
        ========================================================================
      */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-0"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        src="/assets/cloud-bg.mp4"
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          e.currentTarget.play();
        }}
      />

      {/* 
        LIGHT SHEEN OVERLAY (Sky and clouds stay 100% luminous & visible)
        Rule: NO GRADIENTS
      */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] z-10 pointer-events-none" />

      {/* 
        ========================================================================
        CUBIC-BEZIER LIQUID GLASS PILL NAVBAR (Water-Shaped Active Pill)
        Strict fixed height to guarantee 0px layout shifts
        ========================================================================
      */}
      <header
        className={`relative z-30 w-full h-12 shrink-0 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pageRevealed ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        {/* Left: Original PixelMusic App Logo & Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-white/20 border border-white/40 p-1 flex items-center justify-center shadow-sm backdrop-blur-md">
            <Image
              src="/assets/pixelmusic-logo.png"
              alt="PixelMusic Logo"
              width={32}
              height={32}
              className="h-full w-full object-contain rounded-lg"
              priority
            />
          </div>
          <span className="font-tall text-2xl md:text-3xl tracking-wide text-white text-shadow-subtle font-extrabold uppercase">
            PixelMusic
          </span>
        </div>

        {/* Center: Sliding Cubic-Bezier Liquid Glass Pill Navbar */}
        <nav
          ref={navContainerRef}
          onMouseLeave={() => moveIndicator(activeNav)}
          className="relative hidden md:flex items-center p-1.5 rounded-full liquid-glass text-xs md:text-sm font-outfit font-medium text-white/90 text-shadow-subtle shrink-0"
        >
          {/* Non-Bordered Water-Shaped Edge Active Pill Indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 water-pill pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />

          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              ref={(el) => {
                navItemRefs.current[item.id] = el;
              }}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              onMouseEnter={() => moveIndicator(item.id)}
              onClick={() => setActiveNav(item.id)}
              className={`relative z-10 px-4 py-1.5 rounded-full transition-colors duration-200 cursor-pointer ${
                activeNav === item.id ? "text-white font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Releases Tag & Sundown Action Pill */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://github.com/ianshulyadav/PixelMusic/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-xs md:text-sm font-outfit font-medium text-white/90 hover:text-white text-shadow-subtle transition-colors"
          >
            v1.4.2
          </a>

          <button
            onClick={() => setDownloadModalOpen(true)}
            className="sundown-btn-dark px-5 py-2 sm:px-6 sm:py-2.5 shadow-lg transition-transform active:scale-95 font-outfit font-semibold text-xs md:text-sm tracking-wide cursor-pointer"
          >
            <span className="sundown-content">
              <span className="material-symbols-rounded filled text-base">download</span>
              <span>Get started</span>
            </span>
          </button>
        </div>
      </header>

      {/* 
        ========================================================================
        CENTER HERO STAGE (COMMANDING HEADLINE, BALANCED VIBE, ZERO CUTOFF)
        ========================================================================
      */}
      <div
        className={`relative z-20 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto py-2 transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pageRevealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        {/* NON-PILL EDITORIAL EYEBROW */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/85 font-semibold">
          <span className="h-px w-6 sm:w-12 bg-white/40" />
          <span className="text-shadow-subtle flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            ANDROID 14 & 15 // MATERIAL 3 EXPRESSIVE
          </span>
          <span className="h-px w-6 sm:w-12 bg-white/40" />
        </div>

        {/* INCREASED, COMMANDING & MAJESTIC HEADLINE */}
        <h1 className="font-tall text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[7.2rem] 2xl:text-[8.2rem] tracking-tight leading-[0.84] text-white uppercase font-black text-shadow-hero">
          Lossless sound
          <br />
          made effortlessly
        </h1>

        {/* REFINED, COMFORTABLE PARAGRAPH (Outfit font, generous breathing room) */}
        <p className="mt-4 sm:mt-6 font-outfit text-base sm:text-lg md:text-xl text-white/95 max-w-2xl leading-[1.7] text-shadow-subtle font-normal mx-auto">
          Bit-perfect local FLAC audio, YouTube Music streaming, and dynamic Material 3 color harmony for Android. Completely free and ad-free.
        </p>

        {/* CENTER CTA PILLS WITH SUNDOWN HOVER EFFECT */}
        <div className="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-3.5 sm:gap-4 flex-wrap">
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="sundown-btn-dark px-8 py-3.5 sm:px-9 sm:py-4 shadow-xl transition-transform active:scale-95 font-outfit font-semibold text-sm sm:text-base tracking-wide cursor-pointer"
          >
            <span className="sundown-content">
              <span>Download APK</span>
              <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center ml-1">
                <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </span>
            </span>
          </button>

          <a
            href="https://github.com/ianshulyadav/PixelMusic"
            target="_blank"
            rel="noopener noreferrer"
            className="sundown-btn-glass px-6 py-3.5 sm:px-7 sm:py-4 shadow-md transition-transform active:scale-95 font-outfit font-medium text-xs sm:text-sm tracking-wide text-shadow-subtle cursor-pointer"
          >
            <span className="sundown-content">
              <span className="material-symbols-rounded text-base">code</span>
              <span>View Source on GitHub</span>
            </span>
          </a>
        </div>
      </div>

      {/* 
        ========================================================================
        MINIMAL BOTTOM FOOTER & ZERO-LAYOUT-SHIFT AUDIO CONTROLLER PILL
        Fixed height h-9 to completely eliminate any vertical layout shifts
        ========================================================================
      */}
      <footer
        className={`relative z-30 w-full h-9 shrink-0 flex items-center justify-between text-[11px] sm:text-xs font-outfit text-white/80 text-shadow-subtle transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pageRevealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 shrink-0">
          <span>100% Kotlin</span>
          <span>•</span>
          <span>Jetpack Media3</span>
          <span>•</span>
          <span>GPL-3.0 License</span>
        </div>

        {/* Zero-Layout-Shift Fixed Dimension Audio Pill */}
        <button
          onClick={toggleBgAudio}
          className="h-7 px-3 rounded-full liquid-glass text-white/95 hover:text-white flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer select-none"
          title={isAudioPlaying ? "Mute Background Audio" : "Play Background Audio (Golden Brown)"}
        >
          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0 overflow-hidden">
            {isAudioPlaying ? (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-white rounded-full soundwave-bar-1" />
                <span className="w-0.5 bg-white rounded-full soundwave-bar-2" />
                <span className="w-0.5 bg-white rounded-full soundwave-bar-3" />
              </span>
            ) : (
              <span className="material-symbols-rounded text-sm leading-none">volume_off</span>
            )}
          </span>
          <span className="font-outfit text-[11px] font-medium tracking-wide leading-none whitespace-nowrap">
            {isAudioPlaying ? "Audio: Playing" : "Audio: Muted"}
          </span>
        </button>

        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <a
            href="https://github.com/ianshulyadav/PixelMusic"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            @ianshulyadav
          </a>
          <span>•</span>
          <span>Zero Telemetry</span>
        </div>
      </footer>

      {/* 
        ========================================================================
        DOWNLOAD MODAL (Liquid Glass Tonal Surface, No Gradients)
        ========================================================================
      */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl liquid-glass-white p-6 shadow-2xl text-zinc-900">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                  <span className="material-symbols-rounded filled text-lg">download</span>
                </div>
                <div>
                  <h3 className="font-tall text-2xl font-bold tracking-wide text-zinc-900 leading-none">
                    DOWNLOAD PIXELMUSIC
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-500 mt-0.5">
                    v1.4.2 STABLE • ANDROID 13+
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDownloadModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-rounded text-base">close</span>
              </button>
            </div>

            {/* Download Options */}
            <div className="py-4 space-y-3">
              <a
                href="https://github.com/ianshulyadav/PixelMusic/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all group shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded filled text-2xl">android</span>
                  <div>
                    <div className="font-outfit font-bold text-sm">Universal APK Build</div>
                    <div className="font-mono text-[11px] text-zinc-400">arm64-v8a • armeabi-v7a</div>
                  </div>
                </div>
                <span className="material-symbols-rounded text-xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>

              <a
                href="https://github.com/ianshulyadav/PixelMusic/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-2xl text-zinc-800">folder_zip</span>
                  <div>
                    <div className="font-outfit font-medium text-sm text-zinc-900">GitHub Releases Page</div>
                    <div className="font-mono text-[11px] text-zinc-500">Changelogs & source tarballs</div>
                  </div>
                </div>
                <span className="material-symbols-rounded text-xl text-zinc-700 group-hover:translate-x-1 transition-transform">
                  open_in_new
                </span>
              </a>

              {/* SHA-256 Checksum */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>SHA-256 VERIFIED CHECKSUM</span>
                  <button
                    onClick={handleCopyChecksum}
                    className="hover:text-zinc-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-xs">
                      {copiedChecksum ? "check" : "content_copy"}
                    </span>
                    <span>{copiedChecksum ? "COPIED" : "COPY HASH"}</span>
                  </button>
                </div>
                <p className="font-mono text-[10px] text-zinc-600 break-all select-all">
                  e8a4d70c91b5c3e08210fe9132d40902bbff289c4176d65313a52140ab508b04
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>GNU GPL v3.0</span>
              <a
                href="https://github.com/ianshulyadav/PixelMusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 font-medium hover:underline cursor-pointer"
              >
                github.com/ianshulyadav/PixelMusic
              </a>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
