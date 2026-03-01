"use client";

import { Menu, X, ChevronRight, MapPin, Loader2, User, Mail } from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuiz, getRandomPassageFromJsonl, saveQuestionsForSubject, setTrialUserId, QUESTIONS_PER_SUBJECT, clearQuizStorage } from "@/lib/quiz";
import supabase from "@/lib/SupabaseClient";
import { RocketLoader } from "@/components/RocketLoader";

const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 255;
const MAX_LOCATION_LEN = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: string, maxLen: number): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
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
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationValue, setLocationValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  // Request browser location when trial modal opens
  useEffect(() => {
    if (!trialModalOpen) return;
    setLocationStatus('requesting');
    setLocationValue("");
    if (!navigator.geolocation) {
      setLocationStatus('denied');
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
            setLocationStatus('granted');
          })
          .catch(() => {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setLocationStatus('granted');
          });
      },
      () => setLocationStatus('denied'),
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
    try {
      // Check if user has already attempted 3 or more times
      const { count: attemptCount, error: countError } = await supabase
        .from("trailpeoples")
        .select("id", { count: "exact", head: true })
        .eq("email", sanitizedEmail);

      if (countError) {
        setSubmitError("Could not verify your attempts. Please try again.");
        setSubmitting(false);
        return;
      }

      if (attemptCount != null && attemptCount >= 3) {
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

      // Save to trailpeoples; get id for trailquiz.userid when user submits quiz
      const { data: insertData, error: insertError } = await supabase
        .from("trailpeoples")
        .insert({
          name: sanitizedName,
          email: sanitizedEmail,
          location: sanitizedLocation,
          ipaddress: ipAddress,
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

      const trialUserId = insertData?.id != null ? Number(insertData.id) : null;
      if (trialUserId != null) setTrialUserId(trialUserId);

      const biologyPassage = await getRandomPassageFromJsonl("/mcqsjson/biology.jsonl");
      if (!biologyPassage) {
        setSubmitError("Could not load quiz content. Please try again.");
        setSubmitting(false);
        return;
      }
      const questions = await generateQuiz({
        passage: biologyPassage,
        num_questions: QUESTIONS_PER_SUBJECT,
      });
      if (questions.length === 0) {
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
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "/privacypolicy" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex justify-between items-center gap-2">
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center shrink-0 group z-10">
          <img
            src="navimage.png"
            alt="Prepzy"
            className="h-10 sm:h-12 lg:h-14 w-auto max-h-14 transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav - Center: only from lg so all links fit on one line */}
        <div
          className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center flex-nowrap min-h-[48px] backdrop-blur-xl rounded-full px-4 xl:px-6 py-2 shadow-2xl gap-0.5"
          style={{
            backgroundColor: '#050F2A',
            border: '1px solid rgba(123, 187, 255, 0.25)',
            boxShadow: '0 8px 32px rgba(123, 187, 255, 0.15), 0 0 0 1px rgba(123, 187, 255, 0.1)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium px-3 xl:px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap shrink-0"
              style={{ color: '#F2FDFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(123, 187, 255, 0.12)';
                e.currentTarget.style.color = '#7BBBFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#F2FDFF';
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Trial Quiz Button - Right Side */}
        <div className="hidden lg:flex items-center shrink-0 z-10">
          <button
            type="button"
            onClick={() => setTrialModalOpen(true)}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-5 xl:px-6 py-2.5 xl:py-3 text-sm xl:text-base shadow-lg shadow-primary/25 whitespace-nowrap inline-block text-center"
          >
            Try a trial quiz
          </button>
        </div>

        {/* Mobile/Tablet Menu Button - shown below lg */}
        <div className="lg:hidden flex items-center shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg text-[#F2FDFF] hover:text-[#7BBBFF] hover:bg-[#7BBBFF]/10 transition-colors touch-manipulation"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
 <AnimatePresence>
      {/* Mobile Nav */}
 {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl mt-2 max-h-[calc(100vh-6rem)] overflow-y-auto"
              style={{
                backgroundColor: '#050F2A',
                border: '1px solid rgba(123, 187, 255, 0.25)',
                boxShadow: '0 8px 32px rgba(123, 187, 255, 0.15), 0 0 0 1px rgba(123, 187, 255, 0.1), inset 0 1px 0 rgba(242, 253, 255, 0.1)',
              }}
            >
              <div className="p-4 sm:p-6 space-y-1 sm:space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between text-lg font-medium text-[#F2FDFF] hover:text-[#7BBBFF] px-4 py-3.5 rounded-xl transition-all duration-300 hover:bg-[#7BBBFF]/10 active:scale-95"
                    style={{
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronRight 
                      className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                    />
                  </motion.a>
                ))}
                
                {/* Divider */}
                <div className="py-3">
                  <div 
                    className="h-px w-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(123, 187, 255, 0.3), transparent)'
                    }}
                  />
                </div>

                {/* Trial Quiz Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                >
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); setTrialModalOpen(true); }}
                    className="block w-full py-4 px-6 rounded-full font-bold text-lg text-center text-[#050F2A] bg-[#7BBBFF] hover:bg-[#7BBBFF]/90 active:scale-95 transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 24px rgba(123, 187, 255, 0.4), 0 2px 8px rgba(123, 187, 255, 0.3)'
                    }}
                  >
                    Try a trial quiz
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

      {/* Trial Quiz Modal */}
      <AnimatePresence>
        {trialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => !submitting && setTrialModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #0a1a3a 0%, #050F2A 100%)",
                border: "1px solid rgba(123, 187, 255, 0.3)",
                boxShadow: "0 0 0 1px rgba(123, 187, 255, 0.08), 0 24px 48px -12px rgba(0,0,0,0.5), 0 0 80px -20px rgba(123, 187, 255, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient accent */}
              <div
                className="h-1 w-full"
                style={{ background: "linear-gradient(90deg, #7BBFFF, #B8A9FF)" }}
              />
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F2FDFF] tracking-tight">
                      Try a trial quiz
                    </h3>
                    <p className="text-sm text-[#99b3cc] mt-1.5">
                      Enter your details to start a short chemistry quiz. We use a fixed passage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => !submitting && setTrialModalOpen(false)}
                    className="p-2.5 rounded-xl text-[#99b3cc] hover:text-[#F2FDFF] hover:bg-[#7BBBFF]/10 transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleTrialSubmit} className="space-y-5 mt-6">
                  <div>
                    <label htmlFor="trial-name" className="flex items-center gap-2 text-sm font-medium text-[#F2FDFF] mb-2">
                      <User className="w-4 h-4 text-[#7BBFFF]" />
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
                      className="w-full rounded-xl px-4 py-3.5 bg-[#050F2A]/80 border border-[#7BBFFF]/25 text-[#F2FDFF] placeholder:text-[#7BBFFF]/35 focus:outline-none focus:ring-2 focus:ring-[#7BBFFF]/40 focus:border-[#7BBFFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="trial-email" className="flex items-center gap-2 text-sm font-medium text-[#F2FDFF] mb-2">
                      <Mail className="w-4 h-4 text-[#7BBFFF]" />
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
                      className="w-full rounded-xl px-4 py-3.5 bg-[#050F2A]/80 border border-[#7BBFFF]/25 text-[#F2FDFF] placeholder:text-[#7BBFFF]/35 focus:outline-none focus:ring-2 focus:ring-[#7BBFFF]/40 focus:border-[#7BBFFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#F2FDFF] mb-2">
                      <MapPin className="w-4 h-4 text-[#7BBFFF]" />
                      Location
                    </label>
                    {locationStatus === "requesting" && (
                      <div className="rounded-xl px-4 py-3.5 bg-[#050F2A]/80 border border-[#7BBFFF]/25 text-[#99b3cc] text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#7BBFFF]" />
                        Allow location access in your browser to use your current location.
                      </div>
                    )}
                    {locationStatus === "granted" && (
                      <div className="rounded-xl px-4 py-3.5 bg-[#050F2A]/80 border border-[#7BBFFF]/25 text-[#B0C8E0] text-sm">
                        {locationValue}
                      </div>
                    )}
                    {locationStatus === "denied" && (
                      <input
                        id="trial-location"
                        type="text"
                        maxLength={MAX_LOCATION_LEN}
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value.slice(0, MAX_LOCATION_LEN))}
                        placeholder="Enter your city or location"
                        className="w-full rounded-xl px-4 py-3.5 bg-[#050F2A]/80 border border-[#7BBFFF]/25 text-[#F2FDFF] placeholder:text-[#7BBFFF]/35 focus:outline-none focus:ring-2 focus:ring-[#7BBFFF]/40 focus:border-[#7BBFFF]/50 transition-all"
                      />
                    )}
                  </div>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                    >
                      {submitError}
                    </motion.div>
                  )}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => !submitting && setTrialModalOpen(false)}
                      className="flex-1 py-3.5 rounded-xl font-medium border border-[#7BBFFF]/30 text-[#F2FDFF] hover:bg-[#7BBBFF]/10 hover:border-[#7BBFFF]/40 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 disabled:opacity-70 disabled:pointer-events-none transition-all shadow-[0_0_20px_-4px_rgba(123,191,255,0.4)]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
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

      {/* Full-screen rocket loader while MCQs are being fetched */}
      <AnimatePresence>
        {submitting && <RocketLoader key="rocket-loader" />}
      </AnimatePresence>
    </nav>
  );
}