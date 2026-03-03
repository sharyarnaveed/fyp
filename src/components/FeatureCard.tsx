"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  accentColor?: string;
  glowColor?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  delay = 0,
  accentColor = "#7BBFFF",
  glowColor = "rgba(123,191,255,0.15)",
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-40px" }}
      className="group p-6 sm:p-8 rounded-2xl bg-[#0a1a3a]/70 backdrop-blur-sm border border-white/[0.06] hover:border-opacity-40 transition-all duration-400 relative overflow-hidden"
      style={{
        // @ts-expect-error CSS custom properties
        "--accent": accentColor,
        "--glow": glowColor,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      {/* Corner glow on hover */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: glowColor }}
      />

      <div className="relative z-10">
        <div
          className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
          style={{ background: `${accentColor}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>

        <h3
          className="text-xl font-display font-bold mb-2 text-[#F2FDFF] group-hover:transition-colors duration-300"
          style={{ "--tw-text-opacity": 1 } as React.CSSProperties}
        >
          <span className="group-hover:text-[var(--accent)] transition-colors duration-300">
            {title}
          </span>
        </h3>

        <p className="leading-relaxed text-[#99b3cc] text-[15px]">{description}</p>
      </div>

      {/* Bottom border glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-60 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent 10%, ${accentColor}40 50%, transparent 90%)` }}
      />
    </motion.div>
  );
}
