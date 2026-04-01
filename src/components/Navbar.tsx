"use client";

import { Menu, X, ChevronRight, MapPin, Loader2, User, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateQuiz,
  getRandomPassageFromJsonl,
  saveQuestionsForSubject,
  setTrialUserId,
  QUESTIONS_PER_SUBJECT,
  clearQuizStorage,
} from "@/lib/quiz";
import supabase from "@/lib/SupabaseClient";
import { RocketLoader } from "@/components/RocketLoader";

const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 255;
const MAX_LOCATION_LEN = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: string, maxLen: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLen);
}

function validateTrialForm(name: string, email: string, location: string): string | null {
  const n = sanitizeText(name, MAX_NAME_LEN);
  if (!n || n.length < 1) return "Please enter your name.";
  const e = sanitizeText(email, MAX_EMAIL_LEN).toLowerCase();
  if (!e) return "Please enter your email.";
  if (!EMAIL_REGEX.test(e)) return "Please enter a valid email address.";
  const loc = sanitizeText(location, MAX_LOCATION_LEN);
  if (!loc) return "Please provide your location (allow access or enter manually).";
  return null;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [locationValue, setLocationValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setTrialModalOpen(true);
    window.addEventListener("open-trial-modal", handler);
    return () => window.removeEventListener("open-trial-modal", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!trialModalOpen) return;
    setLocationStatus("requesting");
    setLocationValue("");
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { "Accept-Language": "en" } }
        )
          .then((res) => res.json())
          .then((data) => {
            const display = data?.address
              ? [data.address.city ?? data.address.town ?? data.address.village, data.address.state, data.address.country]
                  .filter(Boolean)
                  .join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocationValue(display);
            setLocationStatus("granted");
          })
          .catch(() => {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setLocationStatus("granted");
          });
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [trialModalOpen]);

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const sanitizedName = sanitizeText(name, MAX_NAME_LEN);
    const sanitizedEmail = sanitizeText(email, MAX_EMAIL_LEN).toLowerCase();
    const sanitizedLocation = sanitizeText(locationValue, MAX_LOCATION_LEN);

    const validationError = validateTrialForm(name, email, locationValue);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    let trialUserId: number | null = null;
    try {
      const { data: existingAttempts, error: countError } = await supabase
        .from("trailpeoples")
        .select("id, quiztype, location")
        .eq("email", sanitizedEmail);

      if (countError) {
        setSubmitError("Could not verify your attempts. Please try again.");
        setSubmitting(false);
        return;
      }

      const trialAttemptCount = (existingAttempts ?? []).filter((attempt) => {
        if (attempt.quiztype === "trial") return true;
        if (attempt.quiztype === "nsct") return false;
        // Legacy rows before quiztype: treat NSCT intro attempts separately.
        return attempt.location !== "NSCT Intro Page";
      }).length;

      if (trialAttemptCount >= 3) {
        setSubmitError("You have already attempted the trial quiz 3 times. No more attempts are allowed.");
        setSubmitting(false);
        return;
      }

      let ipAddress = "unknown";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = (await ipRes.json()) as { ip?: string };
        if (ipData?.ip && typeof ipData.ip === "string") {
          ipAddress = ipData.ip.slice(0, 45);
        }
      } catch {
        // keep "unknown"
      }

      const { data: insertData, error: insertError } = await supabase
        .from("trailpeoples")
        .insert({
          name: sanitizedName,
          email: sanitizedEmail,
          location: sanitizedLocation,
          ipaddress: ipAddress,
          quiztype: "trial",
        })
        .select("id")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          setSubmitError("This email is already registered. Use a different email or sign in.");
        } else {
          setSubmitError(insertError.message || "Could not save your details. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      trialUserId = insertData?.id != null ? Number(insertData.id) : null;
      if (trialUserId != null) setTrialUserId(trialUserId);

      const biologyPassage = await getRandomPassageFromJsonl("/mcqsjson/biology.jsonl");
      if (!biologyPassage) {
        if (trialUserId != null) {
          await supabase.from("trailpeoples").delete().eq("id", trialUserId);
        }
        setSubmitError("Could not load quiz content. Please try again.");
        setSubmitting(false);
        return;
      }
      const questions = await generateQuiz({
        passage: biologyPassage,
        num_questions: QUESTIONS_PER_SUBJECT,
      });
      if (questions.length === 0) {
        if (trialUserId != null) {
          await supabase.from("trailpeoples").delete().eq("id", trialUserId);
        }
        setSubmitError("Could not generate quiz. Please try again.");
        setSubmitting(false);
        return;
      }
      clearQuizStorage();
      saveQuestionsForSubject("biology", questions);
      setTrialModalOpen(false);
      setName("");
      setEmail("");
      setLocationValue("");
      router.push("/quiz");
    } catch (err) {
      if (trialUserId != null) {
        try {
          await supabase.from("trailpeoples").delete().eq("id", trialUserId);
        } catch {
          // ignore
        }
      }
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Courses", href: "#courses" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-3 sm:px-6 lg:px-10">
      <div
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5"
        style={{
          background: isScrolled ? "rgba(248,252,255,0.75)" : "rgba(248,252,255,0.48)",
          borderColor: "rgba(123,187,255,0.32)",
          backdropFilter: "blur(12px)",
          boxShadow: isScrolled
            ? "0 18px 32px -20px rgba(123,187,255,0.45), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "0 12px 28px -24px rgba(10,15,30,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <Link href="/" className="group z-10 flex shrink-0 items-center">
          <img src="navimage.png" alt="Prepzy" className="h-10 w-auto max-h-14 transition-transform group-hover:scale-105 sm:h-11 lg:h-12" />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[#0A0F1E] transition-all duration-200 hover:bg-[#7BBBFF]/14 hover:text-[#2c66a0] xl:px-4"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link href="/nsct" className="cta-secondary text-sm xl:text-base">
            Attempt NSCT quiz
          </Link>
          <button type="button" onClick={() => setTrialModalOpen(true)} className="cta-primary text-sm xl:text-base">
            Try a trial quiz
          </button>
        </div>

        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-[#0A0F1E] transition-colors hover:bg-[#7BBBFF]/12"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-3 w-full max-w-7xl"
          >
            <div
              className="overflow-hidden rounded-3xl border"
              style={{
                background: "rgba(248,252,255,0.86)",
                borderColor: "rgba(123,187,255,0.34)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="space-y-1 p-4 sm:p-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium text-[#0A0F1E] transition-all duration-300 hover:bg-[#7BBBFF]/14"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </motion.a>
                ))}

                <div className="py-2">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7BBBFF]/40 to-transparent" />
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.05 + 0.1 }}>
                  <Link
                    href="/nsct"
                    onClick={() => setIsOpen(false)}
                    className="cta-secondary mb-3 block w-full text-center"
                  >
                    Attempt NSCT quiz
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setTrialModalOpen(true);
                    }}
                    className="cta-primary block w-full text-center"
                  >
                    Try a trial quiz
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {trialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            onClick={() => !submitting && setTrialModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-3xl border"
              style={{
                background: "linear-gradient(180deg, #F8FCFF 0%, #EEF8FF 100%)",
                borderColor: "rgba(123,187,255,0.38)",
                boxShadow: "0 26px 60px -28px rgba(10,15,30,0.45)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
              <div className="p-6 sm:p-8">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-display font-bold tracking-tight text-[#0A0F1E] sm:text-2xl">Try a trial quiz</h3>
                    <p className="mt-1.5 text-sm text-[#284366]">
                      Enter your details to start a short chemistry quiz. We use a fixed passage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => !submitting && setTrialModalOpen(false)}
                    className="shrink-0 rounded-xl p-2.5 text-[#55769a] transition-colors hover:bg-[#7BBBFF]/14 hover:text-[#0A0F1E]"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleTrialSubmit} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="trial-name" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0A0F1E]">
                      <User className="h-4 w-4 text-[#7BBBFF]" />
                      Name
                    </label>
                    <input
                      id="trial-name"
                      type="text"
                      required
                      maxLength={MAX_NAME_LEN}
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LEN))}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[#7BBBFF]/35 bg-white/80 px-4 py-3.5 text-[#0A0F1E] placeholder:text-[#7BBBFF]/45 focus:border-[#7BBBFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]/25"
                    />
                  </div>

                  <div>
                    <label htmlFor="trial-email" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0A0F1E]">
                      <Mail className="h-4 w-4 text-[#7BBBFF]" />
                      Email
                    </label>
                    <input
                      id="trial-email"
                      type="email"
                      required
                      maxLength={MAX_EMAIL_LEN}
                      value={email}
                      onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL_LEN))}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#7BBBFF]/35 bg-white/80 px-4 py-3.5 text-[#0A0F1E] placeholder:text-[#7BBBFF]/45 focus:border-[#7BBBFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]/25"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0A0F1E]">
                      <MapPin className="h-4 w-4 text-[#7BBBFF]" />
                      Location
                    </label>
                    {locationStatus === "requesting" && (
                      <div className="flex items-center gap-2 rounded-xl border border-[#7BBBFF]/35 bg-white/80 px-4 py-3.5 text-sm text-[#284366]">
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#7BBBFF]" />
                        Allow location access in your browser to use your current location.
                      </div>
                    )}
                    {locationStatus === "granted" && (
                      <div className="rounded-xl border border-[#7BBBFF]/35 bg-white/80 px-4 py-3.5 text-sm text-[#284366]">{locationValue}</div>
                    )}
                    {locationStatus === "denied" && (
                      <input
                        id="trial-location"
                        type="text"
                        maxLength={MAX_LOCATION_LEN}
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value.slice(0, MAX_LOCATION_LEN))}
                        placeholder="Enter your city or location"
                        className="w-full rounded-xl border border-[#7BBBFF]/35 bg-white/80 px-4 py-3.5 text-[#0A0F1E] placeholder:text-[#7BBBFF]/45 focus:border-[#7BBBFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]/25"
                      />
                    )}
                  </div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-amber-400/45 bg-amber-500/12 px-4 py-3 text-sm text-amber-900"
                    >
                      {submitError}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => !submitting && setTrialModalOpen(false)}
                      className="flex-1 rounded-xl border border-[#7BBBFF]/40 py-3.5 font-medium text-[#0A0F1E] transition-all hover:bg-[#7BBBFF]/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#7BBBFF] py-3.5 font-semibold text-white transition-all hover:bg-[#6aaef5] disabled:pointer-events-none disabled:opacity-70"
                      style={{ boxShadow: "0 0 20px rgba(123,187,255,0.4)" }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Starting…
                        </>
                      ) : (
                        "Start quiz"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{submitting && <RocketLoader key="rocket-loader" />}</AnimatePresence>
    </nav>
  );
}
