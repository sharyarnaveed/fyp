"use client";

import { animate, stagger, createTimeline } from "animejs";
import { Hero3D } from "@/components/Hero3D";
import { HeroCard } from "@/components/HeroCard";
import { FeatureCard } from "@/components/FeatureCard";
import { ContactToast } from "@/components/ContactToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Calendar,
  Target,
  FileText,
  BarChart3,
  ChevronRight,
  Star,
  Quote,
  BookOpen,
  Stethoscope,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const statsAnimated = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------- Animate stat counters ---------- */
  const animateStats = useCallback(() => {
    if (statsAnimated.current) return;
    statsAnimated.current = true;

    document.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
      const raw = el.dataset.value ?? "0";
      const suffix = raw.replace(/[\d.]/g, "");
      const num = parseFloat(raw);
      const obj = { v: 0 };
      animate(obj, {
        v: num,
        duration: isMobile ? 900 : 1400,
        ease: isMobile ? "outQuad" : "outExpo",
        onUpdate: () => {
          el.textContent = (num >= 100 ? Math.round(obj.v) : obj.v.toFixed(0)) + suffix;
        },
      });
    });
  }, [isMobile]);

  useEffect(() => {
    /* ---- Hero entrance timeline - simplified on mobile ---- */
    const tl = createTimeline({ defaults: { ease: isMobile ? "outQuad" : "outExpo" } });
    tl.add(".hero-reveal", {
      translateY: [isMobile ? 16 : 28, 0],
      opacity: [0, 1],
      duration: isMobile ? 500 : 760,
      delay: stagger(isMobile ? 70 : 100, { start: isMobile ? 120 : 160 }),
    });

    /* ---- Scroll-triggered section reveals ---- */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const delay = Number(target.dataset.delay ?? 0);

          /* Feature cards get a special entrance - simplified on mobile */
          if (target.classList.contains("feature-card")) {
            animate(target, {
              opacity: [0, 1],
              translateY: [isMobile ? 20 : 34, 0],
              scale: [0.97, 1],
              ease: isMobile ? "outQuad" : "outExpo",
              duration: isMobile ? 480 : 860,
              delay: isMobile ? delay * 0.6 : delay,
            });
          } else if (target.classList.contains("stat-tile")) {
            animate(target, {
              opacity: [0, 1],
              translateY: [isMobile ? 14 : 26, 0],
              scale: [0.96, 1],
              ease: isMobile ? "outQuad" : "outExpo",
              duration: isMobile ? 420 : 700,
              delay: isMobile ? delay * 0.5 : delay,
            });
            animateStats();
          } else if (target.classList.contains("testimonial-card")) {
            animate(target, {
              opacity: [0, 1],
              translateX: [target.classList.contains("tc-left") ? (isMobile ? -12 : -24) : (isMobile ? 12 : 24), 0],
              rotate: isMobile ? [0, 0] : [target.classList.contains("tc-left") ? -1.2 : 1.2, 0],
              ease: isMobile ? "outQuad" : "outExpo",
              duration: isMobile ? 480 : 760,
              delay: isMobile ? delay * 0.6 : delay,
            });
          } else if (target.classList.contains("course-card")) {
            animate(target, {
              opacity: [0, 1],
              translateY: [isMobile ? 20 : 34, 0],
              scale: [0.97, 1],
              ease: isMobile ? "outQuad" : "outExpo",
              duration: isMobile ? 560 : 980,
              delay: isMobile ? delay * 0.5 : delay,
            });
          } else {
            animate(target, {
              opacity: [0, 1],
              translateY: [isMobile ? 14 : 22, 0],
              ease: isMobile ? "outQuad" : "outExpo",
              duration: isMobile ? 420 : 680,
              delay: isMobile ? delay * 0.6 : delay,
            });
          }

          observer.unobserve(target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll<HTMLElement>(".reveal-section").forEach((node) => {
      observer.observe(node);
    });

    /* ---- Floating blobs parallax on mouse - disabled on mobile ---- */
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    if (!isMobile) {
      handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        document.querySelectorAll<HTMLElement>(".hero-blob").forEach((blob, i) => {
          const factor = i === 0 ? 1 : -0.7;
          blob.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
        });
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      observer.disconnect();
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [animateStats, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");

      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      title: "AI Study Assistant",
      description:
        "Ask questions, clear concepts, and get instant explanations in simple language. Your personal AI tutor is available 24/7.",
      icon: Brain,
      accentColor: "var(--primary)",
    },
    {
      title: "AI Quiz Generator",
      description:
        "Upload your notes or choose a topic — Prepzy automatically generates MCQs to test your understanding and track your progress.",
      icon: FileText,
      accentColor: "var(--accent)",
    },
    {
      title: "Smart Document Summarization",
      description:
        "Turn long PDFs and notes into short, easy-to-understand summaries so you can revise faster and smarter.",
      icon: Target,
      accentColor: "var(--primary)",
    },
    {
      title: "Study Planner",
      description:
        "Dynamic scheduling that adapts to your progress and upcoming deadlines. Never miss a topic.",
      icon: Calendar,
      accentColor: "var(--accent)",
    },
    {
      title: "Performance Tracking",
      description:
        "Monitor your quiz scores, identify weak areas, and improve step-by-step with clear progress insights.",
      icon: BarChart3,
      accentColor: "var(--primary)",
    },
    {
      title: "All Study Material in One Place",
      description:
        "Access past papers, notes, and learning resources — or upload your own materials and let AI do the work.",
      icon: Star,
      accentColor: "var(--accent)",
    },
  ];

  const testimonials = [
    {
      name: "Areeba Khan",
      role: "NMDCAT Repeat Candidate",
      content:
        "I used Prezpy for 7 weeks before NMDCAT. The timed quizzes and mistake review helped me stop repeating weak Chemistry concepts. My mock scores moved from 138 to 162.",
      rating: 5,
    },
    {
      name: "Usman Ali",
      role: "ETEA Engineering Applicant",
      content:
        "What I liked in Prezpy was the topic-wise practice. I could do Physics MCQs on my phone during commute and see exactly where I was losing marks.",
      rating: 5,
    },
    {
      name: "Sana Gul",
      role: "Pre-Med Student, Peshawar",
      content:
        "The dashboard is simple and honest. Prezpy showed my weak chapters clearly, so my revision got focused. I finally built a routine I could follow daily.",
      rating: 5,
    },
  ];

  return (
    <div className="landing-shell min-h-screen overflow-x-hidden selection:bg-[#7BBBFF]/25">
      <header className="landing-hero relative min-h-screen px-4 pb-14 pt-28 sm:px-6 lg:px-10">
        <div className="hero-blob hero-blob-a" aria-hidden />
        <div className="hero-blob hero-blob-b" aria-hidden />
        <div className="hero-mesh" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-45 mix-blend-screen">
          <Hero3D />
        </div>

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-12 items-center gap-6 lg:gap-10">
          <div className="col-span-12 lg:col-span-7 lg:pt-10">
            <p className="hero-reveal mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-[#7BBBFF]">
              Smarter prep for ETEA, NMDCAT &amp; more
            </p>
            <h1 className="hero-reveal hero-title mb-7 font-display font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0A0F1E]">
              Crack Exams not <br />
              <span className="hero-gradient-text">Your brain</span>
            </h1>
            <p className="hero-reveal mb-10 max-w-2xl text-base leading-relaxed text-[#284366] sm:text-xl">
              Smart plans, personalized study, and expert tools designed to help
              you achieve top results.
            </p>

            <div className="hero-reveal flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="cta-primary animated-cta sm:hidden"
                onClick={() => window.dispatchEvent(new Event("open-trial-modal"))}
              >
                Start the Trial Quiz
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Button>

              <Button size="lg" className="cta-secondary sm:hidden" asChild>
                <a href="/nsct">Attempt Quiz for NSCT</a>
              </Button>

              <Button
                size="lg"
                className="cta-primary animated-cta hidden sm:inline-flex"
                onClick={() => {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
              >
                Start Learning
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Button>
              <Button size="lg" variant="outline" className="cta-secondary hidden sm:inline-flex" asChild>
                <a href="#courses">View Courses</a>
              </Button>
              <Button size="lg" className="cta-secondary hidden sm:inline-flex" asChild>
                <a href="/nsct">Attempt Quiz for NSCT</a>
              </Button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <HeroCard />
          </div>
        </div>
      </header>

      <section id="about" aria-labelledby="about-heading" className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 lg:gap-12">
          <div className="reveal-section col-span-12 lg:col-span-5" data-delay="0">
            <h2 id="about-heading" className="mb-6 text-4xl font-display font-bold tracking-[-0.03em] text-[#0A0F1E] sm:text-5xl">
              Why choose <span className="text-[#7BBBFF]">Prepzy?</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-[#284366]">
              Preparing for exams shouldn’t be expensive, confusing, or
              stressful. Prepzy uses Artificial Intelligence to simplify
              learning and help you focus on what truly matters.
            </p>
            <ul className="space-y-3">
              {[
                "No expensive coaching centers",
                "No endless PDFs and notes",
                "No wasted time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#10233e]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7BBBFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal-section col-span-12 lg:col-span-7" data-delay="120">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Active Users", value: "10+" },
                { label: "Questions Solved", value: "10M+" },
                { label: "Exam Categories", value: "100+" },
                { label: "Success Rate", value: "94%" },
              ].map((stat, i) => (
                <article key={stat.label} className={`reveal-section stat-tile glass-tile p-6 text-center sm:p-8 ${i % 2 === 0 ? "sm:translate-y-8" : ""}`} data-delay={String(i * 100)}>
                  <p className="stat-value mb-1 text-3xl font-bold tracking-tight text-[#0A0F1E] sm:text-4xl" data-value={stat.value}>0</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a78a7]">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 lg:gap-12">
          <div className="reveal-section col-span-12 lg:col-span-4" data-delay="0">
            <h2 id="features-heading" className="mb-4 text-4xl font-display font-bold tracking-[-0.03em] text-[#0A0F1E] sm:text-5xl">
              Everything you need to <span className="hero-gradient-text">succeed</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-[#284366]">
              A complete toolkit designed to optimize every minute of your study
              time.
            </p>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={idx * 100}
                className={`feature-card ${idx % 3 === 0 ? "sm:col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="courses" aria-labelledby="courses-heading" className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-section mb-10 max-w-3xl" data-delay="0">
            <h2 id="courses-heading" className="mb-4 text-4xl font-display font-bold tracking-[-0.03em] text-[#0A0F1E] sm:text-5xl">
              Prep for <span className="text-[#B8A9FF]">your exam</span>
            </h2>
            <p className="text-lg leading-relaxed text-[#284366]">
              Structured preparation for Pakistan&apos;s major entry tests. Choose your course and start studying smarter.
            </p>
            <div className="mt-6">
              <Button className="cta-primary" asChild>
                <a href="/nsct">
                  Attempt Quiz for NSCT <ChevronRight className="ml-1 inline h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article className="reveal-section course-card glass-tile lg:col-span-5 lg:translate-y-8" data-delay="80">
              <div className="p-7 sm:p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7BBBFF]/18 text-[#7BBBFF]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-3xl font-display font-bold text-[#0A0F1E]">ETEA</h3>
                <p className="mb-4 text-sm font-semibold tracking-wide text-[#4a78a7]">Educational Testing &amp; Evaluation Agency (KPK)</p>
                <p className="mb-6 leading-relaxed text-[#284366]">
                  ETEA is Khyber Pakhtunkhwa&apos;s official testing body. It conducts <strong className="text-[#0A0F1E]">MDCAT</strong>, <strong className="text-[#0A0F1E]">ECAT</strong> (engineering), teaching recruitment, and government recruitment tests. Engineering tests: 200 MCQs, 3 hours, with negative marking.
                </p>
                <ul className="space-y-2 text-sm text-[#284366]">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7BBBFF]" />Medical &amp; engineering entry tests</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7BBBFF]" />Teaching &amp; govt recruitment exams</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7BBBFF]" />Online registration via ETEA portal</li>
                </ul>
                <Button className="cta-secondary mt-6" asChild>
                  <a href="https://etea.edu.pk" target="_blank" rel="noopener noreferrer">
                    Official site <ChevronRight className="ml-1 inline h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>

            <article className="reveal-section course-card glass-tile lg:col-span-7" data-delay="160">
              <div className="p-7 sm:p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8A9FF]/22 text-[#7260c6]">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-3xl font-display font-bold text-[#0A0F1E]">NMDCAT</h3>
                <p className="mb-4 text-sm font-semibold tracking-wide text-[#6d5fbd]">National Medical &amp; Dental College Admission Test</p>
                <p className="mb-6 leading-relaxed text-[#284366]">
                  NMDCAT (also called MDCAT) is the national entrance exam for <strong className="text-[#0A0F1E]">MBBS</strong> and <strong className="text-[#0A0F1E]">BDS</strong> in Pakistan, conducted by PM&amp;DC. Format: 180 MCQs (Biology, Chemistry, Physics, English, Logical Reasoning), 3 hours, no negative marking. Minimum 55% for medical and 50% for dental colleges.
                </p>
                <ul className="space-y-2 text-sm text-[#284366]">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#B8A9FF]" />Biology, Chemistry, Physics, English, Logic</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#B8A9FF]" />Mandatory for MBBS/BDS admission</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#B8A9FF]" />Register at mdcat.pmdc.pk</li>
                </ul>
                <Button className="cta-secondary mt-6" asChild>
                  <a href="https://mdcat.pmdc.pk" target="_blank" rel="noopener noreferrer">
                    Official site <ChevronRight className="ml-1 inline h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="testimonials" aria-labelledby="testimonials-heading" className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 id="testimonials-heading" className="reveal-section mb-10 text-4xl font-display font-bold tracking-[-0.03em] text-[#0A0F1E] sm:text-5xl" data-delay="0">
            Trusted by <span className="text-[#7BBBFF]">Top Performers</span>
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <article
                key={testimonial.name}
                className={`reveal-section testimonial-card ${idx === 0 ? "tc-left" : idx === 2 ? "" : "tc-left"} glass-tile relative p-6 sm:p-7 ${idx === 1 ? "md:translate-y-8" : ""}`}
                data-delay={String(idx * 120)}
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-[#7BBBFF]/25" />
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#7BBBFF] text-[#7BBBFF]" />
                  ))}
                </div>
                <p className="mb-6 italic leading-relaxed text-[#284366]">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="text-lg font-semibold text-[#0A0F1E]">{testimonial.name}</p>
                  <p className="text-sm text-[#4a78a7]">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6">
          <div className="reveal-section glass-tile col-span-12 p-7 lg:col-span-5 sm:p-8" data-delay="0">
            <h2 id="contact-heading" className="mb-4 text-4xl font-display font-bold tracking-[-0.03em] text-[#0A0F1E]">
              Ready to start your journey?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-[#284366]">
              Join thousands of students achieving their dreams with
              Prepzy. Have questions? Drop us a message.
            </p>
            <div className="space-y-4 text-[#10233e]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7BBBFF]/15">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="break-all">support@prepzy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7BBBFF]/15">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Khanpur Rd, Mang</span>
              </div>
            </div>
          </div>

          <div className="reveal-section glass-tile col-span-12 p-7 lg:col-span-7 sm:p-8" data-delay="120">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#0A0F1E]">Name</label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="h-12 border-[#7BBBFF]/40 bg-white/70 text-[#0A0F1E]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#0A0F1E]">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 border-[#7BBBFF]/40 bg-white/70 text-[#0A0F1E]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#0A0F1E]">Message</label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  className="min-h-[120px] border-[#7BBBFF]/40 bg-white/70 text-[#0A0F1E]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="cta-primary w-full">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border border-[#7BBBFF]/40 bg-[#F2FDFF] px-8 py-4 text-base font-semibold text-[#0A0F1E] shadow-[0_18px_34px_-16px_rgba(123,187,255,0.55)] sm:text-lg"
          >
            🚀 Feature coming soon!
          </motion.div>
        )}
      </AnimatePresence>

      {(submitStatus === "success" || submitStatus === "error") && (
        <ContactToast
          type={submitStatus}
          onClose={() => setSubmitStatus("idle")}
        />
      )}
    </div>
  );
}
