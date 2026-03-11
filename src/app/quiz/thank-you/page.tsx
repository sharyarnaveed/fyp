"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Sparkles,
  Home,
  Star,
  Send,
  Trophy,
  BookOpen,
  FlaskConical,
  Atom,
  PartyPopper,
} from "lucide-react";
import { getTrialUserId, loadQuizScore, type QuizScore } from "@/lib/quiz";
import supabase from "@/lib/SupabaseClient";

function FloatingParticle({
  delay,
  x,
  size,
}: {
  delay: number;
  x: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        bottom: "-10%",
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(123,187,255,${0.4 + Math.random() * 0.3}) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -600],
        opacity: [0, 0.9, 0],
        scale: [0.5, 1.3, 0.5],
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

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

export default function QuizThankYouPage() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<QuizScore | null>(null);

  useEffect(() => {
    const s = loadQuizScore();
    if (s) setScore(s);
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setError(null);
    setSubmitting(true);
    try {
      const userId = getTrialUserId();
      await supabase.from("trailfeedback").insert({
        userid: userId,
        feedback:
          [rating ? `Rating: ${rating}/5` : "", feedback.trim()]
            .filter(Boolean)
            .join(" | ") || null,
      });
      setSubmitted(true);
      setFeedback("");
    } catch {
      setError("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scorePercentage = score && score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="min-h-screen landing-shell relative overflow-hidden selection:bg-primary/20">
      {/* Background decorations */}
      <div className="hero-mesh" />
      <div className="hero-blob hero-blob-a" />
      <div className="hero-blob hero-blob-b" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            x={`${8 + i * 9}%`}
            size={6 + (i % 3) * 4}
          />
        ))}
      </div>

      <main className="relative z-10 pt-6 sm:pt-10 md:pt-12 pb-10 sm:pb-16 px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-xl mx-auto w-full"
        >
          {/* Back link */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </motion.div>

          {/* Success hero card */}
          <motion.div
            variants={itemVariants}
            className="glass-tile p-6 sm:p-8 md:p-10"
          >
            {/* Animated success icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative inline-flex"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-400/30 shadow-[0_0_40px_-10px_rgba(52,211,153,0.4)]">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                </div>
                
                {/* Sparkle accents */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -bottom-1 -left-3"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
                
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-emerald-400/30"
                  animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mt-6 mb-3"
              >
                <span className="hero-gradient-text">Quiz Complete!</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto leading-relaxed"
              >
                Your responses have been saved successfully. We&apos;d love to hear your thoughts below.
              </motion.p>
            </div>

            {/* Score display */}
            {score && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mb-8"
              >
                {/* Overall score */}
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 shadow-lg"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/20">
                      <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground font-medium">Your Score</p>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground">
                        {score.correct}
                        <span className="text-muted-foreground text-lg font-normal">/{score.total}</span>
                        <span className={`ml-2 text-sm font-semibold px-2 py-0.5 rounded-md ${
                          scorePercentage >= 70 ? 'bg-emerald-100 text-emerald-700' :
                          scorePercentage >= 50 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {scorePercentage}%
                        </span>
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Subject-wise breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Biology", correct: score.biologyCorrect, total: score.biologyTotal, icon: BookOpen, colorClass: "text-emerald-600", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20" },
                    { label: "Chemistry", correct: score.chemistryCorrect, total: score.chemistryTotal, icon: FlaskConical, colorClass: "text-purple-600", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/20" },
                    { label: "Physics", correct: score.physicsCorrect, total: score.physicsTotal, icon: Atom, colorClass: "text-blue-600", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
                  ].map((sub) => (
                    <motion.div
                      key={sub.label}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className={`rounded-xl p-4 text-center border ${sub.bgClass} ${sub.borderClass} transition-all cursor-default`}
                    >
                      <sub.icon className={`w-5 h-5 mx-auto mb-2 ${sub.colorClass}`} />
                      <p className="text-xs font-medium text-muted-foreground mb-1">{sub.label}</p>
                      <p className={`text-lg font-bold ${sub.colorClass}`}>
                        {sub.correct}<span className="text-muted-foreground text-sm font-normal">/{sub.total}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

            {/* Feedback section */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="feedback-form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: 0.5 }}
                  onSubmit={handleSubmitFeedback}
                  className="space-y-6"
                >
                  {/* Star rating */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <Star className="w-4 h-4 text-primary" />
                      How was your experience?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200 ${
                              rating && star <= rating
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "text-primary/20 hover:text-primary/40"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-amber-600 mt-2 font-medium"
                      >
                        {rating <= 2
                          ? "We appreciate your honesty"
                          : rating <= 3
                            ? "Thank you for the feedback"
                            : rating === 4
                              ? "Glad you liked it!"
                              : "Awesome, thank you!"}
                      </motion.p>
                    )}
                  </div>

                  {/* Textarea */}
                  <div>
                    <label
                      htmlFor="feedback"
                      className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"
                    >
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Share your thoughts (optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What did you like? What could be better? Any suggestions..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white/80 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 resize-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-amber-700 bg-amber-100 px-4 py-2.5 rounded-xl border border-amber-300"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full cta-primary py-3.5 text-base disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="feedback-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center py-8 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-emerald-700 font-semibold text-base mb-1">
                    Thank you for your feedback!
                  </p>
                  <p className="text-emerald-600/70 text-sm">
                    Your input helps us improve the experience
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-primary/10 text-center"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary glass-card border border-primary/20 hover:border-primary/40 hover:bg-white transition-all"
              >
                <Home className="w-4 h-4" />
                Return to home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
