"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function RocketLoader() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Rocket element is ~48px on mobile, ~56px on desktop
  const rocketSize = typeof window !== "undefined" && window.innerWidth < 640 ? 40 : 56;
  const maxTravel = Math.max(0, trackWidth - rocketSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#050F2A]"
      aria-live="polite"
      aria-label="Loading quiz"
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, rgba(242,253,255,0.9), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(123,187,255,0.6), transparent),
              radial-gradient(2px 2px at 50px 160px, rgba(184,169,255,0.5), transparent),
              radial-gradient(2px 2px at 90px 40px, rgba(242,253,255,0.7), transparent),
              radial-gradient(2px 2px at 130px 80px, rgba(123,187,255,0.5), transparent),
              radial-gradient(2px 2px at 160px 120px, rgba(184,169,255,0.4), transparent)
            `,
            backgroundSize: "200px 200px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(123,187,255,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#7BBFFF]/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Track / runway */}
      <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-8 md:px-12 mb-4 sm:mb-6">
        <div
          className="h-px w-full rounded-full opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(123,187,255,0.4) 20%, rgba(184,169,255,0.5) 50%, rgba(123,187,255,0.4) 80%, transparent 100%)",
            boxShadow: "0 0 20px rgba(123,187,255,0.2)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px border-t border-dashed border-[#7BBFFF]/20"
          style={{ borderSpacing: "4px" }}
        />
      </div>

      {/* Rocket container - moves left to right across the full track */}
      <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-8 md:px-12">
        <div ref={trackRef} className="relative w-full h-16 sm:h-20 md:h-24 flex items-center">
          <motion.div
            className="absolute left-0 flex flex-col items-center"
            animate={{ x: [0, maxTravel] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 0.25,
              ease: "easeInOut",
            }}
          >
            {/* Rocket SVG */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="drop-shadow-[0_0_24px_rgba(123,187,255,0.5)]"
            >
              <svg
                width={rocketSize}
                height={rocketSize}
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#7BBFFF]"
              >
                <path
                  d="M28 4L26 20H30L28 4Z"
                  fill="currentColor"
                  opacity={0.9}
                />
                <path
                  d="M28 4C28 4 16 16 16 28C16 36 20 44 28 48C36 44 40 36 40 28C40 16 28 4 28 4Z"
                  fill="url(#rocketGrad)"
                />
                <path
                  d="M20 32L28 36L36 32V44L28 48L20 44V32Z"
                  fill="currentColor"
                  opacity={0.7}
                />
                <ellipse cx="28" cy="26" rx="6" ry="8" fill="#0a1a3a" />
                <path
                  d="M22 48L28 52L34 48V56H22V48Z"
                  fill="currentColor"
                  opacity={0.8}
                />
                <path
                  d="M16 36L12 44L16 40L20 36L16 36Z"
                  fill="#B8A9FF"
                  opacity={0.9}
                />
                <path
                  d="M40 36L44 44L40 40L36 36L40 36Z"
                  fill="#B8A9FF"
                  opacity={0.9}
                />
                <defs>
                  <linearGradient
                    id="rocketGrad"
                    x1="28"
                    y1="4"
                    x2="28"
                    y2="48"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7BBFFF" />
                    <stop offset="0.5" stopColor="#9BCFFF" />
                    <stop offset="1" stopColor="#6B9FDF" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            {/* Flame trail */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-400/80 blur-sm"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.5, 0.8],
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            {/* Exhaust particles */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-[150%] w-2 h-2 rounded-full bg-amber-300/50 blur-[2px]"
              animate={{ opacity: [0, 0.6, 0], x: [-8, -20] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[#99b3cc] text-sm sm:text-base font-medium mt-3 sm:mt-4 text-center px-4"
      >
        Preparing your MCQs...
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[#7BBFFF]/60 text-xs mt-1 px-4 text-center"
      >
        This may take a few seconds
      </motion.p>

      {/* Shimmer progress bar */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-4 sm:px-8 md:px-12 max-w-2xl mx-auto w-full">
        <div className="h-1 sm:h-1.5 rounded-full bg-[#0a1a3a]/80 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-transparent via-[#7BBFFF]/80 to-transparent"
            style={{ width: "50%" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
