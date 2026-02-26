"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";

interface DiagnosticFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticForm({ isOpen, onClose }: DiagnosticFormProps) {
  const router = useRouter();
  const { detectedCity } = useLocation();
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill city when modal opens if we have a detected location
  useEffect(() => {
    if (isOpen && detectedCity) {
      setCity((prev) => prev || detectedCity);
    }
  }, [isOpen, detectedCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to your API
    setSubmitted(true);
    setEmail("");
    setCity("");
    onClose();
    router.push("/quiz");
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: "#050F2A",
                border: "1px solid rgba(123, 187, 255, 0.25)",
                boxShadow:
                  "0 8px 32px rgba(123, 187, 255, 0.15), 0 0 0 1px rgba(123, 187, 255, 0.1)",
              }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(123,187,255,0.2)]">
                <h2 className="text-xl font-semibold text-[#F2FDFF]">
                  Trial quiz
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-[#F2FDFF] hover:text-[#7BBBFF] hover:bg-[#7BBBFF]/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {submitted ? (
                  <p className="text-[#F2FDFF] text-center py-4">
                    Thanks! We&apos;ll be in touch with your trial quiz results.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="diagnostic-email"
                        className="block text-sm font-medium text-[#F2FDFF] mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="diagnostic-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl px-4 py-3 bg-[#0a1638] border border-[rgba(123,187,255,0.3)] text-[#F2FDFF] placeholder:text-[#7BBBFF]/50 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="diagnostic-city"
                        className="block text-sm font-medium text-[#F2FDFF] mb-2"
                      >
                        City
                      </label>
                      <input
                        id="diagnostic-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="e.g. Lahore, Karachi"
                        className="w-full rounded-xl px-4 py-3 bg-[#0a1638] border border-[rgba(123,187,255,0.3)] text-[#F2FDFF] placeholder:text-[#7BBBFF]/50 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF] focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 rounded-xl font-medium text-[#F2FDFF] border border-[rgba(123,187,255,0.3)] hover:bg-[#7BBBFF]/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#050F2A] bg-[#7BBBFF] hover:bg-[#7BBBFF]/90 transition-colors shadow-lg shadow-[#7BBBFF]/25"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
