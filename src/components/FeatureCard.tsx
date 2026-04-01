import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";
import { animate } from "animejs";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  accentColor?: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  delay = 0,
  accentColor = "var(--primary)",
  className,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Skip complex animations on mobile
    if (isMobile) return;
    
    if (iconRef.current) {
      animate(iconRef.current, {
        scale: [1, 1.1, 1.04],
        rotate: [0, -4, 0],
        duration: 340,
        ease: "outCubic",
      });
    }
    if (barRef.current) {
      animate(barRef.current, {
        width: ["96px", "136px"],
        opacity: [0.8, 1],
        duration: 300,
        ease: "outCubic",
      });
    }
    if (cardRef.current) {
      animate(cardRef.current, {
        translateY: -2,
        duration: 220,
        ease: "outCubic",
      });
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    // Skip complex animations on mobile
    if (isMobile) return;
    
    if (iconRef.current) {
      animate(iconRef.current, {
        scale: 1,
        rotate: 0,
        duration: 260,
        ease: "outCubic",
      });
    }
    if (barRef.current) {
      animate(barRef.current, {
        width: "96px",
        opacity: 0.8,
        duration: 260,
        ease: "outCubic",
      });
    }
    if (cardRef.current) {
      animate(cardRef.current, {
        translateY: 0,
        duration: 240,
        ease: "outCubic",
      });
    }
  }, [isMobile]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "reveal-section glass-tile group relative overflow-hidden p-6 sm:p-7 cursor-pointer",
        className
      )}
      data-delay={String(delay)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={barRef}
        className="absolute left-0 top-0 h-1 w-24 rounded-r-full opacity-80"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
      <div
        ref={iconRef}
        className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7BBBFF]/25 bg-white/55"
        style={{ color: accentColor }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-2xl font-display font-bold leading-tight tracking-[-0.02em] text-[#0A0F1E]">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-[#284366]">{description}</p>
    </article>
  );
}
