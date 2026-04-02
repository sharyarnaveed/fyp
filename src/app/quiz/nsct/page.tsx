"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Send,
} from "lucide-react";
import supabase from "@/lib/SupabaseClient";
import { getTrialUserId } from "@/lib/quiz";
import {
  generateNsctQuestionSet,
  formatNsctTimer,
  NSCT_DURATION_MINUTES,
  NSCT_BASE_QUESTIONS,
  NSCT_BONUS_QUESTIONS,
  NSCT_AI_START_AT_QUESTION,
  NSCT_QUESTIONS_KEY,
  NSCT_ANSWERS_KEY,
  NSCT_END_AT_KEY,
  NSCT_SCORE_KEY,
} from "@/lib/nsct";
import type { QuizQuestion } from "@/lib/quiz";

function readStoredQuestions(): QuizQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(NSCT_QUESTIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as QuizQuestion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredAnswers(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(NSCT_ANSWERS_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, number>;
    const clean: Record<number, number> = {};
    for (const key of Object.keys(parsed)) {
      const idx = Number.parseInt(key, 10);
      const val = parsed[key];
      if (Number.isFinite(idx) && Number.isFinite(val) && val >= 0 && val <= 3) {
        clean[idx] = val;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

function persistAnswers(answers: Record<number, number>): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NSCT_ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    // ignore
  }
}

function persistQuestions(questions: QuizQuestion[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NSCT_QUESTIONS_KEY, JSON.stringify(questions));
  } catch {
    // ignore
  }
}

function getOrCreateEndAt(): number {
  const now = Date.now();
  const fallback = now + NSCT_DURATION_MINUTES * 60 * 1000;
  if (typeof window === "undefined") return fallback;

  try {
    const stored = sessionStorage.getItem(NSCT_END_AT_KEY);
    if (!stored) {
      sessionStorage.setItem(NSCT_END_AT_KEY, String(fallback));
      return fallback;
    }

    const parsed = Number.parseInt(stored, 10);
    if (!Number.isFinite(parsed)) {
      sessionStorage.setItem(NSCT_END_AT_KEY, String(fallback));
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

function setNsctScore(correct: number, total: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NSCT_SCORE_KEY, JSON.stringify({ correct, total }));
  } catch {
    // ignore
  }
}

function countAnsweredInRange(answers: Record<number, number>, totalQuestions: number): number {
  let answered = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (answers[i] != null) answered++;
  }
  return answered;
}

export default function NsctQuizPage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>(() => readStoredAnswers());
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBonus, setLoadingBonus] = useState(false);
  const [bonusLoaded, setBonusLoaded] = useState(false);
  const [bonusRequested, setBonusRequested] = useState(false);
  const [bonusUnavailable, setBonusUnavailable] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(NSCT_DURATION_MINUTES * 60);
  const [locked, setLocked] = useState(false);
  const [revealedCorrections, setRevealedCorrections] = useState<Record<number, true>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobileScreen(media.matches);
    onChange();

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const userId = getTrialUserId();
    if (userId == null) {
      router.replace("/nsct");
      return;
    }

    let mounted = true;
    const bootstrap = async () => {
      setLoading(true);
      setError(null);
      try {
        const existing = readStoredQuestions();
        const loaded = existing.length > 0 ? existing : await generateNsctQuestionSet();
        if (existing.length === 0) persistQuestions(loaded);

        const endAt = getOrCreateEndAt();
        const seconds = Math.max(0, Math.floor((endAt - Date.now()) / 1000));

        if (!mounted) return;
        setQuestions(loaded);
        setBonusLoaded(loaded.length > NSCT_BASE_QUESTIONS);
        setBonusRequested(loaded.length > NSCT_BASE_QUESTIONS);
        setRemainingSeconds(seconds);
        if (seconds === 0) setLocked(true);
      } catch {
        if (!mounted) return;
        setError("Could not prepare NSCT quiz. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (loading) return;
    if (locked) return;

    const tick = () => {
      const endAt = getOrCreateEndAt();
      const secs = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
      setRemainingSeconds(secs);
      if (secs === 0) {
        setLocked(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [loading, locked]);

  const total = questions.length;
  const shouldReduceMotion = prefersReducedMotion || isMobileScreen;
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;
  const current = questions[index];
  const selected = answers[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const shouldLoadBonus = !bonusLoaded && !bonusUnavailable && total === NSCT_BASE_QUESTIONS && isLast;
  const shouldPrefetchBonus =
    !bonusLoaded &&
    !bonusUnavailable &&
    !loadingBonus &&
    !bonusRequested &&
    total === NSCT_BASE_QUESTIONS &&
    index >= NSCT_AI_START_AT_QUESTION - 1;
  const hasAnsweredCurrent = selected != null;
  const isCurrentCorrect = hasAnsweredCurrent ? selected === current?.correctIndex : false;
  const correctionRevealedForCurrent = revealedCorrections[index] === true;
  const showCorrection = hasAnsweredCurrent && !isCurrentCorrect && correctionRevealedForCurrent;
  const holdAdvanceToRevealCorrection = hasAnsweredCurrent && !isCurrentCorrect && !correctionRevealedForCurrent;
  const optionsLocked = locked || hasAnsweredCurrent;
  const correctOptionText = current?.options?.[current.correctIndex] ?? "";

  const scorePreview = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < index; i++) {
      if (answers[i] != null && answers[i] === questions[i].correctIndex) {
        correct++;
      }
    }
    return correct;
  }, [answers, questions, index]);

  const answeredPreview = useMemo(() => {
    let answered = 0;
    for (let i = 0; i < index; i++) {
      if (answers[i] != null) answered++;
    }
    return answered;
  }, [answers, index]);

  const selectOption = (optionIndex: number) => {
    if (optionsLocked) return;
    setAnswers((prev) => {
      const next = { ...prev, [index]: optionIndex };
      persistAnswers(next);
      return next;
    });
  };

  const revealCorrectionForCurrent = () => {
    if (!hasAnsweredCurrent || isCurrentCorrect) return;
    setRevealedCorrections((prev) => {
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
  };

  const handleNext = () => {
    if (holdAdvanceToRevealCorrection) {
      revealCorrectionForCurrent();
      return;
    }
    setIndex((v) => Math.min(total - 1, v + 1));
  };

  const handleLoadBonus = () => {
    if (holdAdvanceToRevealCorrection) {
      revealCorrectionForCurrent();
      return;
    }
    void loadBonusQuestions(true);
  };

  const loadBonusQuestions = async (advanceAfterLoad: boolean) => {
    if (loadingBonus || bonusLoaded) return;

    setBonusRequested(true);
    setBonusUnavailable(false);
    setLoadingBonus(true);
    if (advanceAfterLoad) setError(null);
    try {
      const response = await fetch("/api/nsct/bonus", { method: "POST" });
      if (!response.ok) {
        throw new Error("Bonus generation request failed.");
      }

      const data = (await response.json()) as { questions?: QuizQuestion[] };
      const incoming = Array.isArray(data.questions) ? data.questions : [];
      if (incoming.length === 0) {
        throw new Error("No bonus questions received.");
      }

      setQuestions((prev) => {
        const seen = new Set(prev.map((q) => q.question.trim().toLowerCase()));
        const uniqueIncoming = incoming.filter((q) => {
          const key = q.question.trim().toLowerCase();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const bonus = uniqueIncoming.slice(0, NSCT_BONUS_QUESTIONS).map((q, idx) => ({
          ...q,
          id: prev.length + idx + 1,
        }));

        const merged = [...prev, ...bonus];
        persistQuestions(merged);
        return merged;
      });

      setBonusLoaded(true);
      setBonusUnavailable(false);
      if (advanceAfterLoad) {
        setIndex((prev) => prev + 1);
      }
    } catch {
      setBonusRequested(false);
      setBonusUnavailable(true);
      if (advanceAfterLoad) {
        setError("Could not load bonus AI-generated questions. You can submit now.");
      }
    } finally {
      setLoadingBonus(false);
    }
  };

  useEffect(() => {
    if (!shouldPrefetchBonus) return;
    void loadBonusQuestions(false);
  }, [shouldPrefetchBonus]);

  const submitQuiz = async () => {
    if (submitting || questions.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const userId = getTrialUserId();
      if (userId == null) {
        throw new Error("Session expired. Please restart NSCT from the instructions page.");
      }

      let correct = 0;
      const correctResponses: Array<{
        questionNumber: number;
        questionId: number;
        selectedIndex: number;
      }> = [];

      for (let i = 0; i < questions.length; i++) {
        if (answers[i] != null && answers[i] === questions[i].correctIndex) {
          correct++;
          correctResponses.push({
            questionNumber: i + 1,
            questionId: questions[i].id,
            selectedIndex: answers[i],
          });
        }
      }
      const totalQuestions = questions.length;

      setNsctScore(correct, totalQuestions);

      const responcemodel = {
        quizType: "nsct",
        timedOut: locked,
        durationMinutes: NSCT_DURATION_MINUTES,
        totalQuestions,
        correctResponses,
        summary: {
          correct,
          answered: countAnsweredInRange(answers, totalQuestions),
        },
      };

      const { error: insertError } = await supabase.from("trailquiz").insert({
        userid: userId,
        responcemodel,
      });
      if (insertError) {
        throw new Error(insertError.message || "Could not save NSCT responses.");
      }

      const { error: updateError } = await supabase
        .from("trailpeoples")
        .update({ score: `${correct}/${totalQuestions}` })
        .eq("id", userId);
      if (updateError) {
        console.error("NSCT score update warning:", updateError.message);
      }

      router.push("/quiz/nsct/thank-you");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not submit your quiz. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen landing-shell relative overflow-hidden flex items-center justify-center px-4">
        <div className="hero-mesh" />
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#7BBBFF]" />
          <p className="text-sm font-medium text-[#35557c]">Preparing your NSCT attempt...</p>
        </div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="min-h-screen landing-shell relative overflow-hidden px-4 pb-16 pt-28 sm:px-6">
        <div className="hero-mesh" />
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="relative z-10 mx-auto w-full max-w-xl glass-tile p-7 sm:p-8 text-center">
          <h1 className="mb-3 text-2xl font-display font-bold text-[#0A0F1E]">NSCT quiz unavailable</h1>
          <p className="mb-6 text-sm text-[#35557c]">{error || "Could not load quiz questions."}</p>
          <Link href="/nsct" className="cta-primary inline-flex">Return to NSCT start</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen landing-shell relative overflow-hidden selection:bg-[#7BBBFF]/20">
      <div className="hero-mesh" />
      <div className="hero-blob hero-blob-a" />
      <div className="hero-blob hero-blob-b" />

      <main className="relative z-10 px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
        <div className="mx-auto w-full max-w-4xl">
          <Link href="/nsct" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#35557c] hover:text-[#0A0F1E]">
            <ArrowLeft className="h-4 w-4" />
            Back to NSCT instructions
          </Link>

          <section className="glass-tile mb-5 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4a78a7]">NSCT Attempt</p>
                <h1 className="text-xl font-display font-bold text-[#0A0F1E] sm:text-2xl">Question {index + 1} of {total}</h1>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${locked ? "border-amber-400 bg-amber-50 text-amber-700" : "border-[#7BBBFF]/40 bg-[#F2FDFF] text-[#0A0F1E]"}`}>
                {locked ? <Lock className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                {locked ? "Time over" : formatNsctTimer(remainingSeconds)}
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/80 border border-[#7BBBFF]/20">
              {shouldReduceMotion ? (
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]"
                  style={{ width: `${progress}%` }}
                />
              ) : (
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                />
              )}
            </div>
            <p className="mt-2 text-xs text-[#4a78a7]">
              {countAnsweredInRange(answers, total)} answered out of {total}
            </p>
            {shouldLoadBonus && (
              <p className="mt-1 text-xs font-medium text-[#2b5f92]">
                You have completed {NSCT_BASE_QUESTIONS} questions. Next step will load {NSCT_BONUS_QUESTIONS} bonus AI-generated questions.
              </p>
            )}
            {!bonusLoaded && bonusRequested && total === NSCT_BASE_QUESTIONS && index >= 49 && (
              <p className="mt-1 text-xs font-medium text-[#2b5f92]">
                Preparing bonus AI-generated questions in background...
              </p>
            )}
          </section>

          {shouldReduceMotion ? (
            <section className="glass-tile p-6 sm:p-8">
              <p className="mb-6 text-lg leading-relaxed text-[#0A0F1E]">{current.question}</p>

              <ul className="space-y-3">
                {current.options.map((option, optionIndex) => {
                  const active = selected === optionIndex;
                  return (
                    <li key={`${index}-${optionIndex}`}>
                      <button
                        type="button"
                        onClick={() => selectOption(optionIndex)}
                          disabled={optionsLocked}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-150 ${active ? "border-[#7BBBFF] bg-[#7BBBFF]/10 text-[#0A0F1E]" : "border-[#7BBBFF]/25 bg-white/80 text-[#284366] hover:border-[#7BBBFF]/50"} ${optionsLocked ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        <span className="mr-2 font-semibold text-[#2b5f92]">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {locked && (
                <div className="mt-5 rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900">
                  Time has ended. Answers are now locked. You can still submit your attempt.
                </div>
              )}

              {showCorrection && (
                <div className="mt-5 rounded-xl border border-emerald-400/45 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-900">
                  <p className="font-semibold">
                    Correct answer: {String.fromCharCode(65 + current.correctIndex)}. {correctOptionText}
                  </p>
                  {current.explanation && (
                    <p className="mt-1">Explanation: {current.explanation}</p>
                  )}
                </div>
              )}
            </section>
          ) : (
            <AnimatePresence mode="wait">
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="glass-tile p-6 sm:p-8"
              >
                <p className="mb-6 text-lg leading-relaxed text-[#0A0F1E]">{current.question}</p>

                <ul className="space-y-3">
                  {current.options.map((option, optionIndex) => {
                    const active = selected === optionIndex;
                    return (
                      <li key={`${index}-${optionIndex}`}>
                        <button
                          type="button"
                          onClick={() => selectOption(optionIndex)}
                          disabled={optionsLocked}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-200 ${active ? "border-[#7BBBFF] bg-[#7BBBFF]/10 text-[#0A0F1E]" : "border-[#7BBBFF]/25 bg-white/80 text-[#284366] hover:border-[#7BBBFF]/50"} ${optionsLocked ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <span className="mr-2 font-semibold text-[#2b5f92]">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {locked && (
                  <div className="mt-5 rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900">
                    Time has ended. Answers are now locked. You can still submit your attempt.
                  </div>
                )}

                {showCorrection && (
                  <div className="mt-5 rounded-xl border border-emerald-400/45 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-900">
                    <p className="font-semibold">
                      Correct answer: {String.fromCharCode(65 + current.correctIndex)}. {correctOptionText}
                    </p>
                    {current.explanation && (
                      <p className="mt-1">Explanation: {current.explanation}</p>
                    )}
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
              disabled={isFirst}
              className="inline-flex items-center gap-2 rounded-xl border border-[#7BBBFF]/35 bg-white/70 px-4 py-3 text-sm font-semibold text-[#0A0F1E] disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            {isLast ? (
              shouldLoadBonus ? (
                <button
                  type="button"
                  onClick={handleLoadBonus}
                  disabled={loadingBonus || submitting}
                  className="cta-primary px-6 py-3 text-sm disabled:opacity-70"
                >
                  {loadingBonus ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading bonus AI-generated questions...
                    </>
                  ) : (
                    <>
                      Load Bonus AI Questions
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={submitting}
                className="cta-primary px-6 py-3 text-sm disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Attempt
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="cta-primary px-6 py-3 text-sm"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-5 text-center text-xs text-[#4a78a7]">
            Score preview: {scorePreview} correct from {answeredPreview} answered.
          </div>
        </div>
      </main>
    </div>
  );
}
