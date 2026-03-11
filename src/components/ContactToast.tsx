"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";
import { CheckCircle2, XCircle, Sparkles, Mail, X } from "lucide-react";

interface ContactToastProps {
  type: "success" | "error";
  onClose: () => void;
}

export function ContactToast({ type, onClose }: ContactToastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGSVGElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const isSuccess = type === "success";

  useEffect(() => {
    if (!containerRef.current) return;

    /* ---- Entry timeline ---- */
    const tl = createTimeline({ defaults: { ease: "outExpo" } });

    tl.add(containerRef.current, {
      translateY: [100, 0],
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 700,
    })
      .add(
        iconRef.current!,
        {
          scale: [0, 1.2, 1],
          rotate: ["-90deg", "0deg"],
          duration: 800,
          ease: "outElastic(1, .5)",
        },
        "-=400"
      )
      .add(
        ".toast-text-line",
        {
          opacity: [0, 1],
          translateX: [-16, 0],
          duration: 500,
          delay: (_, i) => i * 80,
        },
        "-=500"
      );

    /* ---- Success sparkles ---- */
    if (isSuccess && sparklesRef.current) {
      const sparkles = sparklesRef.current.querySelectorAll<HTMLElement>(".toast-sparkle");
      sparkles.forEach((s, i) => {
        const angle = (i / sparkles.length) * 360;
        const distance = 35 + Math.random() * 20;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        animate(s, {
          translateX: [0, x],
          translateY: [0, y],
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
          duration: 1000,
          delay: 300 + i * 50,
          ease: "outExpo",
        });
      });
    }

    /* ---- Progress bar countdown ---- */
    if (progressRef.current) {
      animate(progressRef.current, {
        scaleX: [1, 0],
        duration: 5000,
        ease: "linear",
      });
    }

    /* ---- Auto close after 5s ---- */
    const timeout = setTimeout(onClose, 5000);
    return () => clearTimeout(timeout);
  }, [isSuccess, onClose]);

  const handleClose = () => {
    if (!containerRef.current) {
      onClose();
      return;
    }
    animate(containerRef.current, {
      translateY: [0, 100],
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 400,
      ease: "inExpo",
      complete: onClose,
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
        style={{
          background: isSuccess
            ? "linear-gradient(135deg, rgba(236, 253, 245, 0.95), rgba(209, 250, 229, 0.9))"
            : "linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(254, 226, 226, 0.9))",
          borderColor: isSuccess ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
          boxShadow: isSuccess
            ? "0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 60px -20px rgba(16, 185, 129, 0.4)"
            : "0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 60px -20px rgba(239, 68, 68, 0.4)",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-4 px-6 py-5 pr-12 sm:px-8">
          {/* Icon with sparkles */}
          <div className="relative">
            <div
              ref={iconRef}
              className="flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
              style={{
                background: isSuccess
                  ? "linear-gradient(135deg, #10b981, #34d399)"
                  : "linear-gradient(135deg, #ef4444, #f87171)",
                boxShadow: isSuccess
                  ? "0 8px 20px -6px rgba(16, 185, 129, 0.5)"
                  : "0 8px 20px -6px rgba(239, 68, 68, 0.5)",
                transform: "scale(0)",
              }}
            >
              {isSuccess ? (
                <CheckCircle2 ref={checkRef} className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              ) : (
                <XCircle className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              )}
            </div>

            {/* Success sparkles */}
            {isSuccess && (
              <div ref={sparklesRef} className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Sparkles
                    key={i}
                    className="toast-sparkle absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-emerald-400"
                    style={{ opacity: 0 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-0.5">
            <p
              className="toast-text-line text-base font-bold sm:text-lg"
              style={{
                color: isSuccess ? "#065f46" : "#991b1b",
                opacity: 0,
              }}
            >
              {isSuccess ? "Message Sent!" : "Failed to Send"}
            </p>
            <p
              className="toast-text-line flex items-center gap-1.5 text-sm sm:text-base"
              style={{
                color: isSuccess ? "#047857" : "#b91c1c",
                opacity: 0,
              }}
            >
              {isSuccess ? (
                <>
                  <Mail className="h-3.5 w-3.5" />
                  <span>We&apos;ll get back to you soon</span>
                </>
              ) : (
                <span>Please try again later</span>
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-black/5"
          aria-label="Close"
        >
          <X
            className="h-4 w-4"
            style={{ color: isSuccess ? "#047857" : "#b91c1c" }}
          />
        </button>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)" }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{
              background: isSuccess
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #ef4444, #f87171)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
