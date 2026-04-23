"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  XCircle,
  Lightbulb,
  FileQuestion,
  Loader2,
  Sparkles,
  BookOpen,
  Atom,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import {
  loadQuizData,
  loadQuizAnswers,
  saveQuizAnswers,
  getTrialUserId,
  generateQuizForSubject,
  saveQuizScore,
  type QuizQuestion,
} from "@/lib/quiz";
import supabase from "@/lib/SupabaseClient";

const OPTION_LABELS = ["A", "B", "C", "D"];

function isMissingScoreColumnError(message: string): boolean {
  return /could not find the 'score' column/i.test(message) || /column\s+['\"]?score['\"]?\s+does not exist/i.test(message);
}

type SubjectKey = "biology" | "chemistry" | "physics";

const SUBJECT_LABELS: Record<SubjectKey, string> = {
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
};

const SUBJECT_ICONS: Record<SubjectKey, LucideIcon> = {
  biology: BookOpen,
  chemistry: FlaskConical,
  physics: Atom,
};

const SUBJECT_COLORS: Record<SubjectKey, { bg: string; text: string; border: string; glow: string }> = {
  biology: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]",
  },
  chemistry: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/30",
    glow: "shadow-[0_0_20px_-4px_rgba(168,85,247,0.3)]",
  },
  physics: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/30",
    glow: "shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]",
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: -20,
    transition: { duration: 0.3 },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
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
  const [reviewMode, setReviewMode] = useState(false);
  const [wrongQuestionIndexes, setWrongQuestionIndexes] = useState<number[]>([]);
  const [loadingNextSection, setLoadingNextSection] = useState(false);
  const [pendingSection, setPendingSection] = useState<"chemistry" | "physics" | null>(null);
  const [sectionLoadError, setSectionLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasUserId, setHasUserId] = useState<boolean | null>(null);
  const chemistryGenerationInFlight = useRef(false);
  const physicsGenerationInFlight = useRef(false);
  const router = useRouter();

  // Redirect to home if user has no trial user ID
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
  const answeredCount = Object.keys(answers).length;
  const allQuestionsAttempted = total > 0 && answeredCount >= total;
  const atEndOfBiology = biologyCount > 0 && currentIndex === biologyCount - 1;
  const atEndOfChemistry = chemistryCount > 0 && currentIndex === biologyCount + chemistryCount - 1;
  const showNextToSection = atEndOfBiology || atEndOfChemistry;
  const isLast = total > 0 && currentIndex === total - 1 && !showNextToSection;
  const isFirst = currentIndex === 0;
  const hasAnswered = selectedOption !== null;
  const isCorrect = Boolean(reviewMode && question && hasAnswered && selectedOption === question.correctIndex);
  const showExplanation = Boolean(reviewMode && question && hasAnswered && !isCorrect);

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

  const currentSubject = total > 0 ? getSubjectAt(currentIndex, biologyCount, chemistryCount) : "biology";
  const sectionProgress = total > 0 ? getSectionProgress(currentIndex, biologyCount, chemistryCount, physicsCount) : null;

  const ensureSectionLoaded = async (subject: "chemistry" | "physics"): Promise<boolean> => {
    const freshBefore = loadQuizData();
    if (freshBefore[subject].length > 0) {
      setQuizData(freshBefore);
      return true;
    }

    const inFlightRef = subject === "chemistry" ? chemistryGenerationInFlight : physicsGenerationInFlight;
    if (inFlightRef.current) return false;

    inFlightRef.current = true;
    try {
      const ok = await generateQuizForSubject(subject);
      const freshAfter = loadQuizData();
      if (ok && freshAfter[subject].length > 0) {
        setQuizData(freshAfter);
        return true;
      }
      return false;
    } finally {
      inFlightRef.current = false;
    }
  };

  // Start Chemistry generation once user attempts at least 6 Biology questions.
  useEffect(() => {
    if (biologyCount === 0) return;
    if (chemistryCount > 0) return;
    if (biologyAttempted < 6) return;
    void ensureSectionLoaded("chemistry");
  }, [biologyAttempted, biologyCount, chemistryCount]);

  // Start Physics generation once user attempts at least 6 Chemistry questions.
  useEffect(() => {
    if (chemistryCount === 0) return;
    if (physicsCount > 0) return;
    if (chemistryAttempted < 6) return;
    void ensureSectionLoaded("physics");
  }, [chemistryAttempted, chemistryCount, physicsCount]);

  const retryPendingSectionLoad = async () => {
    if (!pendingSection) return;
    setSectionLoadError(null);

    setLoadingNextSection(true);
    const loaded = await ensureSectionLoaded(pendingSection);
    if (loaded) {
      const fresh = loadQuizData();
      setQuizData(fresh);
      if (pendingSection === "chemistry") {
        setCurrentIndex(fresh.biology.length);
      } else {
        setCurrentIndex(fresh.biology.length + fresh.chemistry.length);
      }
      setPendingSection(null);
      setLoadingNextSection(false);
      return;
    }

    setLoadingNextSection(false);
    setSectionLoadError(`Could not load ${pendingSection} questions right now. Please retry.`);
  };

  const goNext = async () => {
    if (isLast) return;
    setSectionLoadError(null);
    if (atEndOfBiology && chemistryCount === 0) {
      setLoadingNextSection(true);
      setPendingSection("chemistry");

      const loaded = await ensureSectionLoaded("chemistry");
      if (loaded) {
        const fresh = loadQuizData();
        setQuizData(fresh);
        setCurrentIndex(fresh.biology.length);
        setPendingSection(null);
        setLoadingNextSection(false);
        return;
      }

      setLoadingNextSection(false);
      setSectionLoadError("Could not load chemistry questions right now. Please retry.");
      return;
    }
    if (atEndOfChemistry && physicsCount === 0) {
      setLoadingNextSection(true);
      setPendingSection("physics");

      const loaded = await ensureSectionLoaded("physics");
      if (loaded) {
        const fresh = loadQuizData();
        setQuizData(fresh);
        setCurrentIndex(fresh.biology.length + fresh.chemistry.length);
        setPendingSection(null);
        setLoadingNextSection(false);
        return;
      }

      setLoadingNextSection(false);
      setSectionLoadError("Could not load physics questions right now. Please retry.");
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    if (!allQuestionsAttempted) {
      setSubmitError("Please attempt all questions before submitting.");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const userId = getTrialUserId();
      let correct = 0;
      let biologyCorrect = 0;
      let chemistryCorrect = 0;
      let physicsCorrect = 0;
      const wrongIndexes: number[] = [];
      questions.forEach((q, i) => {
        const chosen = answers[i];
        if (chosen != null && chosen === q.correctIndex) {
          correct++;
          if (i < biologyCount) biologyCorrect++;
          else if (i < biologyCount + chemistryCount) chemistryCorrect++;
          else physicsCorrect++;
        } else {
          wrongIndexes.push(i);
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
      const answeredCount = Object.keys(answers).length;
      const wrongCount = total - correct;
      const wrongQuestionNumbers = wrongIndexes.map((idx) => idx + 1);
      const answeredQuestionNumbers = Array.from({ length: total }, (_, idx) => idx + 1).filter(
        (questionNumber) => answers[questionNumber - 1] != null
      );
      const scoreStr = `${correct}/${total}`;
      const responcemodel = {
        quizType: "trial",
        score: {
          value: scoreStr,
          correct,
          wrong: wrongCount,
          total,
          percentage: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0,
        },
        counts: {
          answered: answeredCount,
          unanswered: total - answeredCount,
        },
        answeredQuestionNumbers,
        wrongQuestionNumbers,
        quizData: {
          biology: quizData.biology,
          chemistry: quizData.chemistry,
          physics: quizData.physics,
        },
        userAnswers: answers,
        summary: {
          totalQuestions: total,
          answered: answeredCount,
          correct,
          wrong: wrongCount,
        },
      };
      const { error: insertError } = await supabase.from("trailquiz").insert({
        userid: userId,
        responcemodel,
      });
      if (insertError) {
        throw new Error(insertError.message || "Could not save quiz responses.");
      }

      if (userId != null) {
        const { error: updateError } = await supabase
          .from("trailpeoples")
          .update({ score: scoreStr })
          .eq("id", userId);
        if (updateError) {
          if (!isMissingScoreColumnError(updateError.message)) {
            throw new Error(updateError.message || "Could not update score.");
          }
          console.warn("Skipping trailpeoples.score update because the score column is not available in schema cache.");
        }
      }
      setWrongQuestionIndexes(wrongIndexes);
      setReviewMode(true);
      setCurrentIndex(0);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goToThankYou = () => {
    router.push("/quiz/thank-you");
  };

  // Loading state
  if (hasUserId !== true) {
    return (
      <div className="min-h-screen landing-shell flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="hero-mesh" />
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 relative z-10"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/30 animate-ping" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Preparing your quiz...</p>
        </motion.div>
      </div>
    );
  }

  // No quiz data
  if (questions.length === 0) {
    return (
      <div className="min-h-screen landing-shell relative overflow-hidden">
        <div className="hero-mesh" />
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />

        <main className="relative z-10 pt-10 sm:pt-16 pb-16 px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-2xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to home
              </Link>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="glass-tile p-8 sm:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6"
              >
                <FileQuestion className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                No Quiz Available
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Start a trial quiz from the navigation bar. Click &quot;Try a trial quiz&quot; and enter your details to begin.
              </p>
              
              <Link
                href="/"
                className="cta-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
              >
                Go to Home
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  const SubjectIcon = SUBJECT_ICONS[currentSubject];
  const subjectColor = SUBJECT_COLORS[currentSubject];

  return (
    <div className="min-h-screen landing-shell relative overflow-hidden selection:bg-primary/20">
      {/* Background decorations */}
      <div className="hero-mesh" />
      <div className="hero-blob hero-blob-a" />
      <div className="hero-blob hero-blob-b" />

      <main className="relative z-10 pt-6 sm:pt-10 md:pt-12 pb-10 sm:pb-16 px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-3xl mx-auto w-full"
        >
          {/* Back link */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </motion.div>

          {/* Subject tabs */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
            {(["biology", "chemistry", "physics"] as const).map((sub) => {
              const count = sub === "biology" ? biologyCount : sub === "chemistry" ? chemistryCount : physicsCount;
              const isActive = currentSubject === sub;
              const isLoading = pendingSection === sub || (loadingNextSection && pendingSection === sub);
              const isDone =
                (sub === "biology" && biologyCount > 0 && currentIndex >= biologyCount) ||
                (sub === "chemistry" && chemistryCount > 0 && currentIndex >= biologyCount + chemistryCount) ||
                (sub === "physics" && physicsCount > 0 && currentIndex >= biologyCount + chemistryCount + physicsCount);

              if (count === 0 && !isActive && !isLoading) return null;

              const Icon = SUBJECT_ICONS[sub] as React.FC<{ className?: string }>;
              const colors = SUBJECT_COLORS[sub];

              return (
                <motion.span
                  key={sub}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isLoading
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : isActive
                        ? `${colors.bg} ${colors.text} ${colors.border} border ${colors.glow}`
                        : isDone
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "glass-card text-muted-foreground border border-primary/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {SUBJECT_LABELS[sub]}
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {count > 0 && !isLoading && (
                    <span className="opacity-70 text-xs">
                      {isActive && sectionProgress
                        ? `${sectionProgress.current}/${sectionProgress.total}`
                        : count}
                    </span>
                  )}
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </motion.span>
              );
            })}
          </motion.div>

          {/* Header + Progress */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
                <span className={`p-2 rounded-xl ${subjectColor.bg}`}>
                  <SubjectIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${subjectColor.text}`} />
                </span>
                {sectionProgress
                  ? `${SUBJECT_LABELS[sectionProgress.subject]}`
                  : "Quiz Time"}
              </h1>
              <span className="text-sm font-medium text-muted-foreground bg-white/60 px-3 py-1.5 rounded-lg border border-primary/10">
                Q {sectionProgress?.current || 1} of {sectionProgress?.total || total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 rounded-full bg-white/80 border border-primary/10 overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                style={{ backgroundSize: "200% 100%" }}
                initial={{ width: 0 }}
                animate={{
                  width: `${progress}%`,
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{
                  width: { duration: 0.5, ease: "easeOut" },
                  backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Overall progress: {currentIndex + 1} of {total} questions
            </p>
          </motion.div>

          {/* Loading next section */}
          <AnimatePresence mode="wait">
            {loadingNextSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-tile p-10 sm:p-16 flex flex-col items-center justify-center gap-6 text-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-16 h-16 text-primary" />
                  </motion.div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/20 animate-ping" />
                </div>
                <div>
                  <p className="text-foreground font-display font-bold text-xl mb-2">
                    Loading {pendingSection === "chemistry" ? "Chemistry" : "Physics"}...
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Preparing your next set of questions
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {sectionLoadError && pendingSection && !loadingNextSection && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-amber-400/45 bg-amber-500/12 p-4 text-sm text-amber-900"
            >
              <p>{sectionLoadError}</p>
              <button
                type="button"
                onClick={retryPendingSectionLoad}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-white/70 px-3 py-1.5 font-semibold text-amber-800 hover:bg-white"
              >
                Retry loading {pendingSection}
              </button>
            </motion.div>
          )}

          {/* Question card */}
          <AnimatePresence mode="wait">
            {!reviewMode && !loadingNextSection && question && (
              <motion.div
                key={currentIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-tile p-5 sm:p-8 md:p-10"
              >
                {/* Question badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${subjectColor.bg} ${subjectColor.text} ${subjectColor.border} border`}
                  >
                    <SubjectIcon className="w-3.5 h-3.5" />
                    {SUBJECT_LABELS[currentSubject]}
                  </span>
                  <span className="text-xs text-muted-foreground bg-white/60 px-2.5 py-1 rounded-md">
                    Question {sectionProgress?.current || currentIndex + 1}
                  </span>
                </div>

                {/* Question text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-8 font-medium"
                >
                  {question.question}
                </motion.p>

                {/* Options */}
                <ul className="space-y-3">
                  {question.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOption = idx === question.correctIndex;
                    const showAsCorrect = reviewMode && hasAnswered && isCorrectOption;
                    const showAsWrong = reviewMode && hasAnswered && isSelected && !isCorrectOption;

                    return (
                      <motion.li
                        key={idx}
                        custom={idx}
                        variants={optionVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.button
                          type="button"
                          onClick={() => setSelectedOption(idx)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          disabled={reviewMode}
                          className={`w-full text-left flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                            showAsWrong
                              ? "border-amber-400 bg-amber-50 shadow-[0_0_20px_-4px_rgba(251,191,36,0.3)]"
                              : showAsCorrect
                                ? "border-emerald-400 bg-emerald-50 shadow-[0_0_20px_-4px_rgba(52,211,153,0.3)]"
                                : isSelected
                                  ? "border-primary bg-primary/5 shadow-[0_0_24px_-4px_rgba(123,187,255,0.4)]"
                                  : "border-transparent bg-white/70 hover:bg-white hover:border-primary/30 hover:shadow-lg"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all ${
                              showAsWrong
                                ? "bg-amber-400 text-white"
                                : showAsCorrect
                                  ? "bg-emerald-400 text-white"
                                  : isSelected
                                    ? "bg-primary text-white"
                                    : "bg-gradient-to-br from-primary/10 to-accent/10 text-primary"
                            }`}
                          >
                            {OPTION_LABELS[idx]}
                          </span>
                          <span className="flex-1 text-sm sm:text-base text-foreground leading-relaxed">
                            {opt}
                          </span>
                          {showAsWrong && (
                            <XCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                          )}
                          {(showAsCorrect || (isSelected && isCorrect)) && (
                            <CheckCircle2
                              className={`w-6 h-6 flex-shrink-0 ${
                                showAsCorrect ? "text-emerald-500" : "text-primary"
                              }`}
                            />
                          )}
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6">
                        <p className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-3">
                          <Lightbulb className="w-5 h-5" />
                          Explanation
                        </p>
                        <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {reviewMode && (
              <motion.div
                key="review"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-tile p-5 sm:p-8 md:p-10"
              >
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
                  Quiz Review
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  You got {total - wrongQuestionIndexes.length} out of {total} correct.
                </p>

                {wrongQuestionIndexes.length === 0 ? (
                  <div className="rounded-xl border border-emerald-400/45 bg-emerald-500/12 p-5 text-emerald-900">
                    Excellent work. You answered all questions correctly.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wrongQuestionIndexes.map((questionIndex) => {
                      const wrongQuestion = questions[questionIndex];
                      const chosen = answers[questionIndex];
                      const selectedText = chosen != null ? wrongQuestion.options[chosen] : "Not answered";
                      const correctText = wrongQuestion.options[wrongQuestion.correctIndex];

                      return (
                        <div
                          key={questionIndex}
                          className="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5"
                        >
                          <p className="text-xs font-semibold text-amber-700 mb-2">Question {questionIndex + 1}</p>
                          <p className="text-sm sm:text-base font-medium text-foreground mb-3">{wrongQuestion.question}</p>
                          <p className="text-sm text-foreground/90 mb-1">
                            <span className="font-semibold">Your answer:</span> {selectedText}
                          </p>
                          <p className="text-sm text-foreground/90 mb-2">
                            <span className="font-semibold">Correct answer:</span> {correctText}
                          </p>
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            <span className="font-semibold">Explanation:</span>{" "}
                            {wrongQuestion.explanation || "No explanation available."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goToThankYou}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_30px_-6px_rgba(52,211,153,0.5)] hover:shadow-[0_0_40px_-6px_rgba(52,211,153,0.6)] transition-all"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!reviewMode && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mt-8 gap-4"
            >
            <motion.button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              whileHover={{ scale: isFirst ? 1 : 1.02 }}
              whileTap={{ scale: isFirst ? 1 : 0.98 }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold glass-card border border-primary/20 text-foreground hover:border-primary/40 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </motion.button>

            {/* Dots */}
            {sectionProgress && sectionProgress.total <= 12 && (
              <div className="flex gap-2 justify-center py-1 flex-wrap">
                {Array.from({ length: sectionProgress.total }, (_, i) => {
                  const globalIndex =
                    currentSubject === "biology"
                      ? i
                      : currentSubject === "chemistry"
                        ? biologyCount + i
                        : biologyCount + chemistryCount + i;
                  const isActive = currentIndex === globalIndex;
                  const isAnswered = answers[globalIndex] !== undefined;

                  return (
                    <motion.button
                      key={globalIndex}
                      type="button"
                      onClick={() => setCurrentIndex(globalIndex)}
                      whileHover={{ scale: 1.2 }}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                        isActive
                          ? "bg-primary scale-125 ring-4 ring-primary/20"
                          : isAnswered
                            ? "bg-primary/60 hover:bg-primary/80"
                            : "bg-primary/20 hover:bg-primary/40"
                      }`}
                      aria-label={`Go to question ${i + 1}`}
                    />
                  );
                })}
              </div>
            )}
            {sectionProgress && sectionProgress.total > 12 && (
              <p className="text-sm text-muted-foreground font-medium">
                {sectionProgress.current} / {sectionProgress.total}
              </p>
            )}

            {isLast ? (
              <motion.button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting || !allQuestionsAttempted}
                whileHover={{ scale: submitting || !allQuestionsAttempted ? 1 : 1.02 }}
                whileTap={{ scale: submitting || !allQuestionsAttempted ? 1 : 0.98 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_30px_-6px_rgba(52,211,153,0.5)] hover:shadow-[0_0_40px_-6px_rgba(52,211,153,0.6)] transition-all disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={goNext}
                disabled={loadingNextSection}
                whileHover={{ scale: loadingNextSection ? 1 : 1.02 }}
                whileTap={{ scale: loadingNextSection ? 1 : 0.98 }}
                className="cta-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base disabled:opacity-60 disabled:pointer-events-none"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
            </motion.div>
          )}

          {!reviewMode && isLast && !allQuestionsAttempted && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-amber-900 rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3"
            >
              Please answer all questions before submitting.
            </motion.p>
          )}

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900"
            >
              {submitError}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
