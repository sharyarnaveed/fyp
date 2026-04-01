"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Trophy } from "lucide-react";

const NSCT_SCORE_KEY = "prepzy_nsct_score";

interface NsctScore {
  correct: number;
  total: number;
}

function loadScore(): NsctScore | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(NSCT_SCORE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as NsctScore;
    if (typeof parsed.correct === "number" && typeof parsed.total === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function NsctThankYouPage() {
  const [score, setScore] = useState<NsctScore | null>(null);

  useEffect(() => {
    setScore(loadScore());
  }, []);

  const percent = score && score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div className="min-h-screen landing-shell relative overflow-hidden px-4 pb-14 pt-24 sm:px-6">
      <div className="hero-mesh" />
      <div className="hero-blob hero-blob-a" />
      <div className="hero-blob hero-blob-b" />

      <main className="relative z-10 mx-auto w-full max-w-2xl">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#35557c] hover:text-[#0A0F1E]">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-tile p-8 text-center sm:p-10"
        >
          <div className="mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/16 text-emerald-600">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <h1 className="mb-2 text-3xl font-display font-bold text-[#0A0F1E] sm:text-4xl">
            NSCT Attempt Submitted
          </h1>
          <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-[#35557c] sm:text-base">
            Your responses have been saved successfully. Thank you for attempting the NSCT quiz.
          </p>

          {score && (
            <div className="mx-auto mb-8 max-w-xs rounded-2xl border border-[#7BBBFF]/30 bg-white/70 p-5">
              <p className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4a78a7]">
                <Trophy className="h-4 w-4" />
                Your Score
              </p>
              <p className="text-3xl font-bold text-[#0A0F1E]">
                {score.correct}
                <span className="text-lg font-medium text-[#4a78a7]">/{score.total}</span>
              </p>
              {percent != null && (
                <p className="mt-1 text-sm font-semibold text-[#2f68a1]">{percent}%</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="cta-primary px-6 py-3">Go to Home</Link>
            <Link href="/nsct" className="cta-secondary px-6 py-3 text-center">Start New Attempt</Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
