"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createTimeline } from "animejs";
import { Brain, FileText, BarChart3, Target, Sparkles, Zap } from "lucide-react";

const ORBIT_ICONS = [
  { Icon: Brain, color: "#7BBBFF", label: "AI Tutor" },
  { Icon: FileText, color: "#B8A9FF", label: "Quizzes" },
  { Icon: BarChart3, color: "#7BBBFF", label: "Analytics" },
  { Icon: Target, color: "#B8A9FF", label: "Focus" },
  { Icon: Sparkles, color: "#7BBBFF", label: "Smart" },
  { Icon: Zap, color: "#B8A9FF", label: "Fast" },
];

// Reduced icons for mobile
const MOBILE_ORBIT_ICONS = ORBIT_ICONS.slice(0, 4);

export function HeroCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    /* ---- Entrance timeline - simplified on mobile ---- */
    const tl = createTimeline({
      defaults: { ease: isMobile ? "outQuad" : "outExpo" },
    });

    tl.add(containerRef.current, {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: isMobile ? 600 : 900,
      delay: isMobile ? 400 : 600,
    })
      .add(
        coreRef.current!,
        {
          scale: [0, 1],
          opacity: [0, 1],
          duration: isMobile ? 500 : 800,
          ease: isMobile ? "outQuad" : "outElastic(1, .5)",
        },
        "-=300"
      )
      .add(
        ".orbit-icon",
        {
          scale: [0, 1],
          opacity: [0, 1],
          duration: isMobile ? 400 : 600,
          ease: isMobile ? "outQuad" : "outBack(1.7)",
          delay: stagger(isMobile ? 50 : 80),
        },
        "-=400"
      )
      .add(
        ".hero-card-label",
        {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: isMobile ? 350 : 500,
          delay: stagger(isMobile ? 40 : 60),
        },
        "-=200"
      );

    /* ---- Core pulse - slower on mobile ---- */
    animate(pulseRef.current!, {
      scale: [1, 1.4],
      opacity: [0.4, 0],
      duration: isMobile ? 2500 : 2000,
      ease: "outQuad",
      loop: true,
    });

    /* ---- Orbit rotation - slower on mobile for smoother rendering ---- */
    const orbitDuration = isMobile ? 30000 : 20000;
    animate(orbitRef.current!, {
      rotate: [0, 360],
      duration: orbitDuration,
      ease: "linear",
      loop: true,
    });

    /* ---- Counter-rotate each icon so text stays upright ---- */
    document.querySelectorAll<HTMLElement>(".orbit-icon").forEach((el) => {
      animate(el, {
        rotate: [0, -360],
        duration: orbitDuration,
        ease: "linear",
        loop: true,
      });
    });

    /* ---- Floating particles - reduced count and simpler animation on mobile ---- */
    if (particlesRef.current && !isMobile) {
      const particles = particlesRef.current.querySelectorAll<HTMLElement>(".hero-particle");
      particles.forEach((p, i) => {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        animate(p, {
          translateX: [0, x, 0],
          translateY: [0, y, 0],
          opacity: [0, 0.7, 0],
          scale: [0, 1.2, 0],
          duration: 3000 + i * 400,
          delay: i * 300,
          ease: "inOutSine",
          loop: true,
        });
      });
    }

    /* ---- Score counter ---- */
    if (scoreRef.current) {
      const obj = { v: 0 };
      animate(obj, {
        v: 98,
        duration: isMobile ? 1800 : 2400,
        delay: isMobile ? 800 : 1200,
        ease: "outQuad",
        onUpdate: () => {
          if (scoreRef.current) scoreRef.current.textContent = Math.round(obj.v) + "%";
        },
      });
    }
  }, [isMobile]);

  // Get the icons to display based on device
  const iconsToRender = isMobile ? MOBILE_ORBIT_ICONS : ORBIT_ICONS;
  const particleCount = isMobile ? 4 : 12;

  return (
    <div
      ref={containerRef}
      className="hero-reveal relative flex min-h-[360px] items-center justify-center rounded-[30px] border border-[#7BBBFF]/25 bg-white/40 backdrop-blur-xl sm:min-h-[420px]"
      style={{ opacity: 0, willChange: "transform, opacity" }}
    >
      {/* Background glow spots */}
      <div className="absolute left-6 top-6 h-32 w-32 rounded-full bg-[#7BBBFF]/15 blur-3xl" />
      <div className="absolute bottom-6 right-6 h-36 w-36 rounded-full bg-[#B8A9FF]/15 blur-3xl" />

      {/* Floating particles - fewer on mobile */}
      {!isMobile && (
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden rounded-[30px]">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div
              key={i}
              className="hero-particle absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "#7BBBFF" : "#B8A9FF",
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      )}

      {/* Orbit ring */}
      <div 
        ref={orbitRef} 
        className="relative h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]"
        style={{ willChange: "transform" }}
      >
        {/* Orbit path visual */}
        <div className="absolute inset-4 rounded-full border border-dashed border-[#7BBBFF]/20" />
        {!isMobile && <div className="absolute inset-10 rounded-full border border-dashed border-[#B8A9FF]/15" />}

        {/* Orbiting icons - fewer on mobile */}
        {iconsToRender.map((item, i) => {
          const angle = (i / iconsToRender.length) * 360;
          const radius = 46;
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={item.label}
              className="orbit-icon absolute flex flex-col items-center gap-1"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0,
                willChange: "transform",
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white/80 shadow-lg shadow-[#7BBBFF]/10 backdrop-blur-sm sm:h-12 sm:w-12"
                style={{ borderColor: `${item.color}40` }}
              >
                <item.Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: item.color }} />
              </div>
              <span
                className="hero-card-label text-[10px] font-semibold tracking-wide sm:text-xs"
                style={{ color: item.color, opacity: 0 }}
              >
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Center core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Pulse ring */}
          <div
            ref={pulseRef}
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-24 sm:w-24"
            style={{
              background: "radial-gradient(circle, rgba(123,187,255,0.35), transparent 70%)",
              willChange: "transform, opacity",
            }}
          />
          {/* Core circle */}
          <div
            ref={coreRef}
            className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-[#7BBBFF]/30 bg-gradient-to-br from-white/90 to-[#EEF8FF] shadow-xl shadow-[#7BBBFF]/15 sm:h-24 sm:w-24"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <span
              ref={scoreRef}
              className="text-xl font-extrabold tracking-tight text-[#0A0F1E] sm:text-2xl"
            >
              0%
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7BBBFF] sm:text-[10px]">
              Score
            </span>
          </div>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="hero-card-label flex items-center gap-2 rounded-full border border-[#7BBBFF]/25 bg-white/70 px-4 py-2 text-xs font-semibold text-[#284366] shadow-md shadow-[#7BBBFF]/8 backdrop-blur-sm sm:text-sm" style={{ opacity: 0, willChange: "transform, opacity" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          AI-Powered Study Engine
        </div>
      </div>
    </div>
  );
}
