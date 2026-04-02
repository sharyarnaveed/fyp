"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3, FileQuestion, ShieldCheck, Mail, Loader2, ChevronRight, MapPin } from "lucide-react";
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
const MAX_LOCATION_LEN = 300;

function sanitizeEmail(value: string): string {
  return value.trim().slice(0, MAX_EMAIL_LEN).toLowerCase();
}

function sanitizeLocation(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_LOCATION_LEN);
}

async function resolveLocationFromBrowser(): Promise<string | null> {
  if (typeof window === "undefined" || !navigator.geolocation) return null;

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    });
  });

  const { latitude, longitude } = position.coords;

  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const geoData = (await geoRes.json()) as {
      address?: { city?: string; town?: string; village?: string; state?: string; country?: string };
    };
    const address = geoData?.address;
    if (address) {
      const composed = [address.city ?? address.town ?? address.village, address.state, address.country]
        .filter(Boolean)
        .join(", ");
      if (composed) return sanitizeLocation(composed);
    }
  } catch {
    // Fallback to coordinates below.
  }

  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export default function NsctIntroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalMessage, setLocationModalMessage] = useState("Please enable location in your browser to continue.");
  const [error, setError] = useState<string | null>(null);

  const openLocationModal = (message: string) => {
    setLocationModalMessage(message);
    setError(message);
    setShowLocationModal(true);
  };

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

      let locationValue = "";
      try {
        const detectedLocation = await resolveLocationFromBrowser();
        if (!detectedLocation) {
          openLocationModal("Location access is required to start the NSCT quiz. Please enable location in your browser settings.");
          setSubmitting(false);
          return;
        }
        locationValue = sanitizeLocation(detectedLocation);
      } catch {
        openLocationModal("Location access is required. Please enable location in your browser settings and try again.");
        setSubmitting(false);
        return;
      }

      const { data: insertData, error: insertError } = await supabase
        .from("trailpeoples")
        .insert({
          name: "NSCT Candidate",
          email: cleanedEmail,
          location: locationValue,
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

            <div className="rounded-xl border border-[#7BBBFF]/30 bg-white/65 px-4 py-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#7BBBFF]" />
                <span>
                  <span className="text-sm font-semibold text-[#0A0F1E]">
                    Location sharing is required
                  </span>
                  <p className="mt-1 text-xs text-[#4a78a7]">
                    Please allow browser location permission to start the quiz.
                  </p>
                </span>
              </div>
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

      {showLocationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1E]/50 px-4"
          onClick={() => setShowLocationModal(false)}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#7BBBFF]/30 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-2 text-[#0A0F1E]">
              <MapPin className="h-5 w-5 text-[#2f68a1]" />
              <h3 className="text-lg font-semibold">Enable location</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#284366]">
              {locationModalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
