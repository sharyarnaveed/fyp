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
        background: `radial-gradient(circle, rgba(123,191,255,${0.3 + Math.random() * 0.3}) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -800],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

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

  return (
    <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-hidden selection:bg-[#7BBFFF]/30 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.6}
            x={`${10 + i * 11}%`}
            size={4 + (i % 3) * 3}
          />
        ))}
        {/* Gradient orbs */}
        <div
          className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #7BBFFF 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #B8A9FF 0%, transparent 70%)",
          }}
        />
      </div>

      <main className="relative z-10 pt-6 sm:pt-10 md:pt-12 pb-10 sm:pb-16 px-3 sm:px-5 md:px-6">
        <div className="max-w-xl mx-auto w-full">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#99b3cc] hover:text-[#7BBFFF] transition-colors mb-6 sm:mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Back to home
            </Link>
          </motion.div>

          {/* Success hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-2xl sm:rounded-3xl border border-[#7BBFFF]/15 bg-gradient-to-b from-[#0a1a3a]/90 to-[#0a1a3a]/60 backdrop-blur-sm p-5 sm:p-8 md:p-10 shadow-[0_0_60px_-15px_rgba(123,191,255,0.12)]"
          >
            {/* Animated check icon */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative inline-flex"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-500/25 to-emerald-600/10 border border-emerald-400/20">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                </div>
                {/* Sparkle accents */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400/80" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-1 -left-2 sm:-bottom-2 sm:-left-3"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8A9FF]/60" />
                </motion.div>
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/20"
                  animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[#F2FDFF] mt-5 sm:mt-6 mb-2 sm:mb-3 leading-tight"
              >
                Quiz Complete!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-[#99b3cc] text-xs sm:text-sm md:text-base max-w-sm mx-auto leading-relaxed"
              >
                Your responses have been saved successfully. We&apos;d love to
                hear your thoughts below.
              </motion.p>
            </div>

            {/* Score display */}
            {score && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                {/* Overall score */}
                <div className="text-center mb-5 sm:mb-6">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#7BBFFF]/15 to-[#B8A9FF]/15 border border-[#7BBFFF]/20">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F2FDFF]">
                      {score.correct}
                      <span className="text-[#99b3cc] text-base sm:text-lg md:text-xl font-normal">/{score.total}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#99b3cc] font-medium">
                      ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                {/* Subject-wise breakdown */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Biology", correct: score.biologyCorrect, total: score.biologyTotal, icon: BookOpen, color: "#5BE0A7", bgColor: "rgba(91,224,167,0.12)", borderColor: "rgba(91,224,167,0.2)" },
                    { label: "Chemistry", correct: score.chemistryCorrect, total: score.chemistryTotal, icon: FlaskConical, color: "#B8A9FF", bgColor: "rgba(184,169,255,0.12)", borderColor: "rgba(184,169,255,0.2)" },
                    { label: "Physics", correct: score.physicsCorrect, total: score.physicsTotal, icon: Atom, color: "#7BBFFF", bgColor: "rgba(123,191,255,0.12)", borderColor: "rgba(123,191,255,0.2)" },
                  ].map((sub) => (
                    <div
                      key={sub.label}
                      className="rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border transition-all"
                      style={{ backgroundColor: sub.bgColor, borderColor: sub.borderColor }}
                    >
                      <sub.icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2" style={{ color: sub.color }} />
                      <p className="text-[10px] sm:text-xs font-medium text-[#99b3cc] mb-1">{sub.label}</p>
                      <p className="text-sm sm:text-lg font-bold" style={{ color: sub.color }}>
                        {sub.correct}<span className="text-[#99b3cc] text-xs sm:text-sm font-normal">/{sub.total}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7BBFFF]/20 to-transparent mb-6 sm:mb-8" />

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
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Star rating */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#B0C8E0] mb-2.5 sm:mb-3">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7BBFFF]" />
                      How was your experience?
                    </label>
                    <div className="flex gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="group relative p-1 sm:p-1.5 transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200 ${
                              rating && star <= rating
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                                : "text-[#7BBFFF]/25 group-hover:text-[#7BBFFF]/50"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] sm:text-xs text-amber-400/70 mt-1.5"
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
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#B0C8E0] mb-2 sm:mb-2.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7BBFFF]" />
                      Share your thoughts (optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What did you like? What could be better? Any suggestions..."
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#7BBFFF]/15 bg-[#050F2A]/60 text-[#F2FDFF] text-xs sm:text-sm placeholder:text-[#99b3cc]/40 focus:outline-none focus:ring-2 focus:ring-[#7BBFFF]/40 focus:border-[#7BBFFF]/30 resize-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs sm:text-sm text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-400/20"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#7BBFFF] to-[#9BCFFF] text-[#050F2A] hover:from-[#8CC7FF] hover:to-[#A8D6FF] shadow-[0_0_30px_-8px_rgba(123,191,255,0.4)] hover:shadow-[0_0_40px_-8px_rgba(123,191,255,0.5)] transition-all disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Submitting&hellip;
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Submit feedback
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="feedback-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center py-6 sm:py-8 rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-emerald-300 font-semibold text-sm sm:text-base mb-1">
                    Thank you for your feedback!
                  </p>
                  <p className="text-emerald-400/60 text-[10px] sm:text-xs">
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
              className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#7BBFFF]/10 text-center"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-[#7BBFFF] border border-[#7BBFFF]/20 hover:bg-[#7BBFFF]/10 hover:border-[#7BBFFF]/30 transition-all"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Return to home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
