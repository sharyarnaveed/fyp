"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3, FileQuestion, ShieldCheck, Mail, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/SupabaseClient";
import { clearQuizStorage, setTrialUserId } from "@/lib/quiz";
import {
  clearNsctAttemptStorage,
  NSCT_DURATION_MINUTES,
  NSCT_BASE_QUESTIONS,
  NSCT_BONUS_QUESTIONS,
} from "@/lib/nsct";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 255;

function sanitizeEmail(value: string): string {
  return value.trim().slice(0, MAX_EMAIL_LEN).toLowerCase();
}

export default function NsctIntroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedEmail = sanitizeEmail(email);
    if (!cleanedEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!EMAIL_REGEX.test(cleanedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      let ipAddress = "unknown";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = (await ipRes.json()) as { ip?: string };
        if (ipData?.ip) ipAddress = String(ipData.ip).slice(0, 45);
      } catch {
        // keep default value
      }

      const { data: insertData, error: insertError } = await supabase
        .from("trailpeoples")
        .insert({
          name: "NSCT Candidate",
          email: cleanedEmail,
          location: "NSCT Intro Page",
          ipaddress: ipAddress,
          quiztype: "nsct",
        })
        .select("id")
        .single();

      if (insertError || !insertData?.id) {
        setError(insertError?.message || "Could not save your details. Please try again.");
        setSubmitting(false);
        return;
      }

      setTrialUserId(Number(insertData.id));
      clearQuizStorage();
        clearNsctAttemptStorage();
      router.push("/quiz/nsct");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    {
      icon: Clock3,
      title: `${NSCT_DURATION_MINUTES} Minutes`,
      text: "The timer starts as soon as your quiz opens.",
    },
    {
      icon: FileQuestion,
      title: `${NSCT_BASE_QUESTIONS} + ${NSCT_BONUS_QUESTIONS} MCQs`,
      text: `Start with ${NSCT_BASE_QUESTIONS} category questions, then load ${NSCT_BONUS_QUESTIONS} AI bonus MCQs.`,
    },
    {
      icon: ShieldCheck,
      title: "Lock on timeout",
      text: "When time ends, answers lock and you can submit manually.",
    },
  ];

  return (
    <div className="landing-shell min-h-screen overflow-x-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="hero-blob hero-blob-a" aria-hidden />
      <div className="hero-blob hero-blob-b" aria-hidden />
      <div className="hero-mesh" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#35557c] hover:text-[#0A0F1E]">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="glass-tile mb-8 p-7 sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#7BBBFF]">National Skills Challenge Test</p>
          <h1 className="mb-4 text-4xl font-display font-extrabold leading-[0.94] tracking-[-0.03em] text-[#0A0F1E] sm:text-5xl">
            Attempt Quiz for <span className="hero-gradient-text">NSCT</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#284366] sm:text-lg">
            Read the instructions carefully, enter your email, and start your full-length timed attempt.
          </p>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-tile p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#7BBBFF]/16 text-[#2f68a1]">
                <card.icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-[#0A0F1E]">{card.title}</h2>
              <p className="text-sm leading-relaxed text-[#284366]">{card.text}</p>
            </motion.article>
          ))}
        </div>

        <section className="glass-tile p-7 sm:p-8">
          <form onSubmit={handleStart} className="space-y-5">
            <div>
              <label htmlFor="nsct-email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0A0F1E]">
                <Mail className="h-4 w-4 text-[#7BBBFF]" />
                Email address
              </label>
              <Input
                id="nsct-email"
                type="email"
                required
                maxLength={MAX_EMAIL_LEN}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 border-[#7BBBFF]/35 bg-white/80 text-[#0A0F1E]"
              />
              <p className="mt-2 text-xs text-[#4a78a7]">
                We use this to record your attempt in the trial quiz system.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            <Button type="submit" disabled={submitting} className="cta-primary w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Starting your attempt...
                </>
              ) : (
                <>
                  Start NSCT Quiz
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
