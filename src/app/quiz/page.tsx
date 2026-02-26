"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, XCircle, Lightbulb } from "lucide-react";

// Mock quiz data for UI (correctIndex is 0-based)
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctIndex: 1,
    explanation:
      "Mitochondria are known as the powerhouse of the cell because they produce most of the cell's supply of ATP (adenosine triphosphate), the main energy currency used for cellular processes.",
  },
  {
    id: 2,
    question: "What is the chemical formula for water?",
    options: ["CO2", "H2O", "O2", "NaCl"],
    correctIndex: 1,
    explanation:
      "Water is a compound made of two hydrogen atoms bonded to one oxygen atom, hence the formula H2O. CO2 is carbon dioxide, O2 is oxygen gas, and NaCl is table salt.",
  },
  {
    id: 3,
    question: "Newton's first law of motion is also known as:",
    options: ["Law of inertia", "Law of acceleration", "Law of action-reaction", "Law of gravitation"],
    correctIndex: 0,
    explanation:
      "Newton's first law states that an object remains at rest or in uniform motion unless acted upon by an external force. This property of resisting change in motion is called inertia.",
  },
  {
    id: 4,
    question: "Which organ is responsible for pumping blood throughout the body?",
    options: ["Lungs", "Heart", "Liver", "Kidney"],
    correctIndex: 1,
    explanation:
      "The heart is a muscular organ that contracts to pump oxygenated blood to the body and deoxygenated blood to the lungs. The lungs exchange gases; the liver and kidneys filter and process blood but do not pump it.",
  },
  {
    id: 5,
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correctIndex: 2,
    explanation:
      "Force is measured in newtons (N) in the SI system. Joule is the unit of energy, watt is power, and pascal is pressure. One newton is the force needed to accelerate 1 kg by 1 m/s².",
  },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = MOCK_QUESTIONS[currentIndex];
  const total = MOCK_QUESTIONS.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;
  const hasAnswered = selectedOption !== null;
  const isCorrect = hasAnswered && selectedOption === question.correctIndex;
  const showExplanation = hasAnswered && !isCorrect && question.explanation;

  const goNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-x-hidden selection:bg-[#7BBFFF]/30">
      <main className="pt-10 sm:pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#99b3cc] hover:text-[#7BBFFF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <p className="text-[#7BBFFF] font-medium text-sm tracking-wide uppercase mb-1">
              Trial quiz
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F2FDFF]">
              Attempt your quiz
            </h1>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-[#0a1a3a] overflow-hidden mb-10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#7BBFFF] to-[#B8A9FF]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {/* Question counter */}
          <p className="text-sm text-[#99b3cc] mb-6">
            Question {currentIndex + 1} of {total}
          </p>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-[#7BBFFF]/20 bg-[#0a1a3a]/80 p-6 sm:p-8 shadow-[0_0_40px_-12px_rgba(123,191,255,0.08)]"
            >
              <p className="text-lg sm:text-xl text-[#F2FDFF] leading-relaxed mb-8 font-medium">
                {question.question}
              </p>

              <ul className="space-y-3">
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
                        className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
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
                          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
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
                        <span className="flex-1">{opt}</span>
                        {showAsWrong && <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                        {(showAsCorrect || (isSelected && isCorrect)) && (
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${showAsCorrect ? "text-emerald-400" : "text-[#7BBFFF]"}`} />
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
                    className="mt-6 rounded-xl border border-amber-400/30 bg-amber-500/10 overflow-hidden"
                  >
                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-2 text-amber-200/90 font-medium text-sm mb-2">
                        <Lightbulb className="w-4 h-4 flex-shrink-0" />
                        Explanation
                      </p>
                      <p className="text-[#F2FDFF]/90 text-sm sm:text-base leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium border border-[#7BBFFF]/30 text-[#F2FDFF] hover:bg-[#7BBFFF]/10 hover:border-[#7BBFFF]/50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-1.5">
              {MOCK_QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(i);
                    setSelectedOption(null);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-[#7BBFFF] scale-125"
                      : "bg-[#7BBFFF]/30 hover:bg-[#7BBFFF]/50"
                  }`}
                  aria-label={`Go to question ${i + 1}`}
                />
              ))}
            </div>

            {isLast ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_24px_-6px_rgba(123,191,255,0.4)] transition-all"
              >
                Submit quiz
                <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_24px_-6px_rgba(123,191,255,0.4)] transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
