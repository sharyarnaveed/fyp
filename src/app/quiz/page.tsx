"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, XCircle, Lightbulb, FileQuestion, Loader2 } from "lucide-react";
import {
  loadQuizData,
  loadQuizAnswers,
  saveQuizAnswers,
  getTrialUserId,
  prefetchChemistry,
  prefetchPhysics,
  saveQuizScore,
  type QuizQuestion,
} from "@/lib/quiz";
import supabase from "@/lib/SupabaseClient";

const OPTION_LABELS = ["A", "B", "C", "D"];

type SubjectKey = "biology" | "chemistry" | "physics";

const SUBJECT_LABELS: Record<SubjectKey, string> = {
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
};

function buildFlatQuestions(
  biology: QuizQuestion[],
  chemistry: QuizQuestion[],
  physics: QuizQuestion[]
): QuizQuestion[] {
  return [...biology, ...chemistry, ...physics];
}

function getSubjectAt(
  index: number,
  biologyCount: number,
  chemistryCount: number
): SubjectKey {
  if (index < biologyCount) return "biology";
  if (index < biologyCount + chemistryCount) return "chemistry";
  return "physics";
}

function getSectionProgress(
  index: number,
  biologyCount: number,
  chemistryCount: number,
  physicsCount: number
): { subject: SubjectKey; current: number; total: number } {
  if (index < biologyCount)
    return { subject: "biology", current: index + 1, total: biologyCount };
  if (index < biologyCount + chemistryCount)
    return {
      subject: "chemistry",
      current: index - biologyCount + 1,
      total: chemistryCount,
    };
  return {
    subject: "physics",
    current: index - biologyCount - chemistryCount + 1,
    total: physicsCount,
  };
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState(() => loadQuizData());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => loadQuizAnswers());
  const [loadingNextSection, setLoadingNextSection] = useState(false);
  const [pendingSection, setPendingSection] = useState<"chemistry" | "physics" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasUserId, setHasUserId] = useState<boolean | null>(null);
  const chemistryPrefetchDone = useRef(false);
  const physicsPrefetchDone = useRef(false);
  const router = useRouter();

  // Redirect to home if user has no trial user ID (must complete trial form first)
  useEffect(() => {
    const userId = getTrialUserId();
    if (userId == null) {
      setHasUserId(false);
      router.replace("/");
      return;
    }
    setHasUserId(true);
  }, [router]);

  const biologyCount = quizData.biology.length;
  const chemistryCount = quizData.chemistry.length;
  const physicsCount = quizData.physics.length;
  const questions = buildFlatQuestions(quizData.biology, quizData.chemistry, quizData.physics);
  const total = questions.length;

  const question = questions[currentIndex];
  const selectedOption = answers[currentIndex] ?? null;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const atEndOfBiology = biologyCount > 0 && currentIndex === biologyCount - 1;
  const atEndOfChemistry =
    chemistryCount > 0 && currentIndex === biologyCount + chemistryCount - 1;
  const showNextToSection =
    atEndOfBiology || atEndOfChemistry;
  const isLast =
    total > 0 && currentIndex === total - 1 && !showNextToSection;
  const isFirst = currentIndex === 0;
  const hasAnswered = selectedOption !== null;
  const isCorrect = Boolean(question && hasAnswered && selectedOption === question.correctIndex);
  const showExplanation = Boolean(question && hasAnswered && !isCorrect);

  const setSelectedOption = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [currentIndex]: optionIndex };
      saveQuizAnswers(next);
      return next;
    });
  };
  const biologyAttempted = Object.keys(answers).filter((i) => {
    const idx = parseInt(i, 10);
    return idx >= 0 && idx < biologyCount;
  }).length;
  const chemistryAttempted = Object.keys(answers).filter((i) => {
    const idx = parseInt(i, 10);
    return idx >= biologyCount && idx < biologyCount + chemistryCount;
  }).length;

  const currentSubject =
    total > 0
      ? getSubjectAt(currentIndex, biologyCount, chemistryCount)
      : "biology";
  const sectionProgress =
    total > 0
      ? getSectionProgress(
          currentIndex,
          biologyCount,
          chemistryCount,
          physicsCount
        )
      : null;

  // Prefetch chemistry when user has attempted 2 biology MCQs (once)
  useEffect(() => {
    if (biologyCount === 0) return;
    if (chemistryPrefetchDone.current) return;
    if (chemistryCount > 0) return;
    if (biologyAttempted >= 2) {
      chemistryPrefetchDone.current = true;
      prefetchChemistry();
    }
  }, [biologyAttempted, biologyCount, chemistryCount]);

  // Prefetch physics when user has attempted 2 chemistry MCQs (once)
  useEffect(() => {
    if (chemistryCount === 0) return;
    if (physicsPrefetchDone.current) return;
    if (physicsCount > 0) return;
    if (chemistryAttempted >= 2) {
      physicsPrefetchDone.current = true;
      prefetchPhysics();
    }
  }, [chemistryAttempted, biologyCount, chemistryCount, physicsCount]);

  // Poll for next section when user is waiting (e.g. clicked Next at end of section)
  useEffect(() => {
    if (!loadingNextSection || !pendingSection) return;
    const id = setInterval(() => {
      const data = loadQuizData();
      const nextLoaded = data[pendingSection].length > 0;
      if (nextLoaded) {
        setQuizData(data);
        if (pendingSection === "chemistry") {
          setCurrentIndex(data.biology.length);
        } else {
          setCurrentIndex(data.biology.length + data.chemistry.length);
        }
        setPendingSection(null);
        setLoadingNextSection(false);
      }
    }, 500);
    return () => clearInterval(id);
  }, [loadingNextSection, pendingSection]);

  const goNext = () => {
    if (isLast) return;
    if (atEndOfBiology && chemistryCount === 0) {
      const fresh = loadQuizData();
      if (fresh.chemistry.length > 0) {
        setQuizData(fresh);
        setCurrentIndex(fresh.biology.length);
        return;
      }
      setLoadingNextSection(true);
      setPendingSection("chemistry");
      return;
    }
    if (atEndOfChemistry && physicsCount === 0) {
      const fresh = loadQuizData();
      if (fresh.physics.length > 0) {
        setQuizData(fresh);
        setCurrentIndex(fresh.biology.length + fresh.chemistry.length);
        return;
      }
      setLoadingNextSection(true);
      setPendingSection("physics");
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const userId = getTrialUserId();
      let correct = 0;
      let biologyCorrect = 0;
      let chemistryCorrect = 0;
      let physicsCorrect = 0;
      questions.forEach((q, i) => {
        const chosen = answers[i];
        if (chosen != null && chosen === q.correctIndex) {
          correct++;
          if (i < biologyCount) biologyCorrect++;
          else if (i < biologyCount + chemistryCount) chemistryCorrect++;
          else physicsCorrect++;
        }
      });
      saveQuizScore({
        correct,
        total,
        biologyCorrect,
        biologyTotal: biologyCount,
        chemistryCorrect,
        chemistryTotal: chemistryCount,
        physicsCorrect,
        physicsTotal: physicsCount,
      });
      const scoreStr = `${correct}/${total}`;
      const responcemodel = {
        quizData: {
          biology: quizData.biology,
          chemistry: quizData.chemistry,
          physics: quizData.physics,
        },
        userAnswers: answers,
        summary: {
          totalQuestions: total,
          answered: Object.keys(answers).length,
          correct,
        },
      };
      await supabase.from("trailquiz").insert({
        userid: userId,
        responcemodel,
      });
      if (userId != null) {
        await supabase
          .from("trailpeoples")
          .update({ score: scoreStr })
          .eq("id", userId);
      }
      router.push("/quiz/thank-you");
    } catch {
      // non-blocking; user still completed quiz
    } finally {
      setSubmitting(false);
    }
  };

  // No user ID: redirecting to home — show brief loading so we don't flash quiz
  if (hasUserId !== true) {
    return (
      <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#7BBFFF] animate-spin" />
          <p className="text-sm text-[#99b3cc]">Redirecting…</p>
        </div>
      </div>
    );
  }

  // No quiz loaded yet or empty — show start quiz CTA
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-x-hidden selection:bg-[#7BBFFF]/30">
        <main className="pt-10 sm:pt-12 pb-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#99b3cc] hover:text-[#7BBFFF] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <div className="rounded-2xl border border-[#7BBFFF]/20 bg-[#0a1a3a]/80 p-8 sm:p-12 text-center">
              <FileQuestion className="w-14 h-14 text-[#7BBFFF]/60 mx-auto mb-4" />
              <h2 className="text-xl font-display font-bold text-[#F2FDFF] mb-2">
                No quiz yet
              </h2>
              <p className="text-[#99b3cc] text-sm mb-6 max-w-sm mx-auto">
                Start a trial quiz from the nav: click &quot;Try a trial quiz&quot; and enter your details.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_24px_-6px_rgba(123,191,255,0.4)] transition-all"
              >
                Go to home
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-x-hidden selection:bg-[#7BBFFF]/30">
      <main className="pt-6 sm:pt-10 md:pt-12 pb-10 sm:pb-16 px-3 sm:px-5 md:px-6">
        <div className="max-w-2xl mx-auto w-full">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#99b3cc] hover:text-[#7BBFFF] transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back to home
          </Link>

          {/* Section chips: Biology | Chemistry | Physics */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
            {(["biology", "chemistry", "physics"] as const).map((sub) => {
              const count =
                sub === "biology"
                  ? biologyCount
                  : sub === "chemistry"
                    ? chemistryCount
                    : physicsCount;
              const isActive = currentSubject === sub;
              const isLoading =
                pendingSection === sub || (loadingNextSection && pendingSection === sub);
              const isDone =
                (sub === "biology" && biologyCount > 0 && currentIndex >= biologyCount) ||
                (sub === "chemistry" &&
                  chemistryCount > 0 &&
                  currentIndex >= biologyCount + chemistryCount) ||
                (sub === "physics" &&
                  physicsCount > 0 &&
                  currentIndex >= biologyCount + chemistryCount + physicsCount);
              if (count === 0 && !isActive && !isLoading) return null;
              return (
                <span
                  key={sub}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isLoading
                      ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                      : isActive
                        ? "bg-[#7BBFFF] text-[#050F2A] shadow-[0_0_16px_-4px_rgba(123,191,255,0.5)]"
                        : isDone
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : "bg-[#0a1a3a]/80 text-[#99b3cc] border border-[#7BBFFF]/20"
                  }`}
                >
                  {SUBJECT_LABELS[sub]}
                  {isLoading && (
                    <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin opacity-80" />
                  )}
                  {count > 0 && !isLoading && (
                    <span className="opacity-80">
                      {isActive && sectionProgress
                        ? `${sectionProgress.current}/${sectionProgress.total}`
                        : count}
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Header + overall progress */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-base sm:text-xl md:text-2xl font-display font-bold text-[#F2FDFF] mb-2 sm:mb-3 leading-tight">
              {sectionProgress
                ? `${SUBJECT_LABELS[sectionProgress.subject]} — Q ${sectionProgress.current}/${sectionProgress.total}`
                : "Attempt your quiz"}
            </h1>
            <div className="h-1.5 sm:h-2 rounded-full bg-[#0a1a3a] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#7BBFFF] to-[#B8A9FF]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-[#99b3cc] mt-1.5 sm:mt-2">
              Overall: {currentIndex + 1} of {total} questions
            </p>
          </div>

          {/* Loading next section */}
          {loadingNextSection && (
            <div className="rounded-xl sm:rounded-2xl border border-[#7BBFFF]/30 bg-[#0a1a3a]/90 p-6 sm:p-10 md:p-14 flex flex-col items-center justify-center gap-4 sm:gap-5 text-center shadow-[0_0_40px_-12px_rgba(123,191,255,0.12)]">
              <div className="relative">
                <Loader2 className="w-10 h-10 sm:w-14 sm:h-14 text-[#7BBFFF] animate-spin" />
                <div className="absolute inset-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#7BBFFF]/30 animate-ping opacity-20" />
              </div>
              <div>
                <p className="text-[#F2FDFF] font-semibold text-base sm:text-lg">
                  Loading next section…
                </p>
                <p className="text-[#99b3cc] text-xs sm:text-sm mt-1">
                  Preparing your {pendingSection === "chemistry" ? "Chemistry" : "Physics"} questions.
                </p>
              </div>
            </div>
          )}

          {/* Question card */}
          {!loadingNextSection && question && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl sm:rounded-2xl border border-[#7BBFFF]/20 bg-[#0a1a3a]/80 p-4 sm:p-6 md:p-8 shadow-[0_0_40px_-12px_rgba(123,191,255,0.08)]"
            >
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#7BBFFF]/15 text-[#7BBFFF] text-[10px] sm:text-xs font-medium">
                  {SUBJECT_LABELS[currentSubject]}
                </span>
              </div>
              <p className="text-sm sm:text-lg md:text-xl text-[#F2FDFF] leading-relaxed mb-5 sm:mb-8 font-medium">
                {question.question}
              </p>

              <ul className="space-y-2 sm:space-y-3">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === question.correctIndex;
                  const showAsCorrect = hasAnswered && isCorrectOption;
                  const showAsWrong = hasAnswered && isSelected && !isCorrectOption;
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-200 ${
                          showAsWrong
                            ? "border-amber-400/60 bg-amber-500/10 text-[#F2FDFF]"
                            : showAsCorrect
                              ? "border-emerald-400/60 bg-emerald-500/15 text-[#F2FDFF]"
                              : isSelected
                                ? "border-[#7BBFFF] bg-[#7BBFFF]/15 text-[#F2FDFF] shadow-[0_0_20px_-6px_rgba(123,191,255,0.3)]"
                                : "border-[#7BBFFF]/20 bg-[#050F2A]/50 text-[#B0C8E0] hover:border-[#7BBFFF]/40 hover:bg-[#7BBFFF]/5"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold ${
                            showAsWrong
                              ? "bg-amber-400/30 text-amber-300"
                              : showAsCorrect
                                ? "bg-emerald-400/30 text-emerald-300"
                                : isSelected
                                  ? "bg-[#7BBFFF] text-[#050F2A]"
                                  : "bg-[#7BBFFF]/10 text-[#7BBFFF]"
                          }`}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        <span className="flex-1 text-xs sm:text-sm md:text-base leading-snug">{opt}</span>
                        {showAsWrong && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />}
                        {(showAsCorrect || (isSelected && isCorrect)) && (
                          <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${showAsCorrect ? "text-emerald-400" : "text-[#7BBFFF]"}`} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Explanation shown when user selects wrong answer */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 sm:mt-6 rounded-lg sm:rounded-xl border border-amber-400/30 bg-amber-500/10 overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 md:p-5">
                      <p className="flex items-center gap-2 text-amber-200/90 font-medium text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        Explanation
                      </p>
                      <p className="text-[#F2FDFF]/90 text-xs sm:text-sm md:text-base leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 sm:mt-10 gap-2 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium border border-[#7BBFFF]/30 text-[#F2FDFF] hover:bg-[#7BBFFF]/10 hover:border-[#7BBFFF]/50 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline">Prev</span>
            </button>

            {/* Section-only dots: one dot per question in current section */}
            {sectionProgress && sectionProgress.total <= 12 && (
              <div className="flex gap-1 sm:gap-1.5 justify-center py-1 flex-wrap max-w-[40vw] sm:max-w-none">
                {Array.from({ length: sectionProgress.total }, (_, i) => {
                  const globalIndex =
                    currentSubject === "biology"
                      ? i
                      : currentSubject === "chemistry"
                        ? biologyCount + i
                        : biologyCount + chemistryCount + i;
                  return (
                    <button
                      key={globalIndex}
                      type="button"
                      onClick={() => setCurrentIndex(globalIndex)}
                      className={`shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                        currentIndex === globalIndex
                          ? "bg-[#7BBFFF] scale-125 ring-2 ring-[#7BBFFF]/40"
                          : answers[globalIndex] !== undefined
                            ? "bg-[#7BBFFF]/60 hover:bg-[#7BBFFF]/70"
                            : "bg-[#7BBFFF]/20 hover:bg-[#7BBFFF]/40"
                      }`}
                      aria-label={`Go to question ${i + 1} of ${sectionProgress.total}`}
                    />
                  );
                })}
              </div>
            )}
            {sectionProgress && sectionProgress.total > 12 && (
              <p className="text-[10px] sm:text-xs text-[#99b3cc] py-1">
                {sectionProgress.current} / {sectionProgress.total}
              </p>
            )}

            {isLast ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-emerald-500 text-white hover:bg-emerald-500/90 shadow-[0_0_24px_-6px_rgba(52,211,153,0.4)] transition-all shrink-0 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">Saving…</span>
                  </>
                ) : (
                  <>
                    Submit
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={loadingNextSection}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_24px_-6px_rgba(123,191,255,0.4)] transition-all disabled:opacity-60 disabled:pointer-events-none shrink-0"
              >
                Next
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
