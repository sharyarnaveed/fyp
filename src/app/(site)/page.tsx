"use client";

import { Hero3D } from "@/components/Hero3D";
import { FeatureCard } from "@/components/FeatureCard";
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
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes - just log and reset
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Message sent! (Demo mode - no backend)");
  };

  const features = [
    {
      title: "AI Study Assistant",
      description:
        "Ask questions, clear concepts, and get instant explanations in simple language. Your personal AI tutor is available 24/7.",
      icon: Brain,
    },
    {
      title: "AI Quiz Generator",
      description:
        "Upload your notes or choose a topic  Prepzy automatically generates MCQs to test your understanding and track your progress.",
      icon: FileText,
    },
    {
      title: "Smart Document Summarization",
      description:
        "Turn long PDFs and notes into short, easy-to-understand summaries so you can revise faster and smarter.",
      icon: Target,
    },
    {
      title: "Study Planner",
      description:
        "Dynamic scheduling that adapts to your progress and upcoming deadlines. Never miss a topic.",
      icon: Calendar,
    },
    {
      title: "Performance Tracking",
      description:
        "Monitor your quiz scores, identify weak areas, and improve step-by-step with clear progress insights.",
      icon: BarChart3,
    },
    {
      title: "All Study Material in One Place",
      description:
        "Access past papers, notes, and learning resources — or upload your own materials and let AI do the work.",
      icon: Star,
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Medical Student",
      content:
        "ExamMaster transformed my preparation. The mistake tracker is a game changer—I finally stopped making the same errors.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Engineering Aspirant",
      content:
        "The 3D visualizations and interactive quizzes make studying actually fun. I passed my entrance with top ranks!",
      rating: 5,
    },
    {
      name: "Michael Brown",
      role: "Bar Exam Candidate",
      content:
        "Incredible platform. The mock tests are harder than the real thing, which made the actual exam feel like a breeze.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-x-hidden selection:bg-[#7BBFFF]/30 w-full max-w-[100vw]">
      {/* Hero Section */}
      <header className="relative min-h-[80vh] md:min-h-[85vh] lg:h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-0 px-4 sm:px-6">
        <Hero3D />
        {/* Subtle vignette and gradient overlay for depth */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          aria-hidden
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, transparent 55%, rgba(5,15,42,0.4) 100%), linear-gradient(180deg, rgba(5,15,42,0.15) 0%, transparent 30%, transparent 70%, rgba(5,15,42,0.5) 100%)",
          }}
        />
        {/* Soft glow behind headline */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,720px)] h-64 z-[3] pointer-events-none opacity-40"
          aria-hidden
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(123,191,255,0.25) 0%, rgba(184,169,255,0.08) 40%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Decorative line above headline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 h-px w-16 origin-center rounded-full bg-gradient-to-r from-transparent via-[#7BBFFF]/60 to-transparent"
            />
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-4 sm:mb-6 leading-[1.12] text-transparent bg-clip-text bg-gradient-to-r from-[#F2FDFF] via-[#5BA7FF] to-[#B8A9FF] drop-shadow-[0_0_40px_rgba(123,191,255,0.25)] [text-shadow:0_0_80px_rgba(123,191,255,0.15)] break-words">
              Crack Exams not <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BBFFF] to-[#B8A9FF] drop-shadow-[0_0_50px_rgba(184,169,255,0.3)]">
                Your brain
              </span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-[#B0C8E0] mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)] px-0">
              Smart plans, personalized study, and expert tools designed to help
              you achieve top results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_30px_-5px_rgba(123,191,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(123,191,255,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
              >
                Start Learning
                <ChevronRight className="ml-2 w-5 h-5 shrink-0" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full glass-button text-[#F2FDFF] border-[#7BBFFF]/30 bg-[#050F2A]/40 hover:bg-[#7BBFFF]/15 hover:text-[#7BBFFF] hover:border-[#7BBFFF]/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
                asChild
              >
                <a href="#courses">View Courses</a>
              </Button>
            </div>
            {/* Small tagline under buttons */}
            <p className="mt-6 text-sm text-[#7BBFFF]/70 font-medium tracking-wide">
              Smarter prep for ETEA, NMDCAT &amp; more
            </p>
          </motion.div>
        </div>
      </header>

      {/* About / Stats Section */}
      <section id="about" aria-labelledby="about-heading" className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-[#050F2A] via-[#070d22] to-[#050F2A] relative px-4 sm:px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7BBFFF]/20 to-transparent" />
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 id="about-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-[#F2FDFF]">
                Why choose <span className="text-[#7BBFFF]">Prepzy?</span>
              </h2>
              <p className="text-base xs:text-lg text-[#99b3cc] mb-6 leading-relaxed">
                Preparing for exams shouldn’t be expensive, confusing, or
                stressful. Prepzy uses Artificial Intelligence to simplify
                learning and help you focus on what truly matters.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "No expensive coaching centers",
                  "No endless PDFs and notes",
                  "No wasted time",
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#7BBFFF]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#7BBFFF]" />
                    </div>
                    <span className="text-[#F2FDFF]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                { label: "Active Users", value: "10+" },
                { label: "Questions Solved", value: "10M+" },
                { label: "Exam Categories", value: "100+" },
                { label: "Success Rate", value: "94%" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-2xl bg-[#0a1a3a]/80 border border-[#7BBFFF]/15 text-center hover:border-[#7BBFFF]/40 hover:shadow-[0_0_24px_-4px_rgba(123,191,255,0.15)] transition-all duration-300"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7BBFFF] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#99b3cc] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" aria-labelledby="features-heading" className="py-14 sm:py-20 md:py-28 bg-[#050F2A] relative px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(123,191,255,0.04)_0%,transparent_50%)] pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-20">
            <h2 id="features-heading" className="text-2xl xs:text-3xl sm:text-5xl font-display font-bold mb-4 text-[#F2FDFF]">
              Everything you need to{" "}
              <span className="text-[#B8A9FF]">succeed</span>
            </h2>
            <p className="text-[#99b3cc] text-base xs:text-lg max-w-xl sm:max-w-2xl mx-auto">
              A complete toolkit designed to optimize every minute of your study
              time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" aria-labelledby="courses-heading" className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-[#050F2A] via-[#070d22] to-[#050F2A] relative px-4 sm:px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B8A9FF]/20 to-transparent" />
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-20">
            <h2 id="courses-heading" className="text-2xl xs:text-3xl sm:text-5xl font-display font-bold mb-4 text-[#F2FDFF]">
              Prep for <span className="text-[#B8A9FF]">your exam</span>
            </h2>
            <p className="text-[#99b3cc] text-base xs:text-lg max-w-xl sm:max-w-2xl mx-auto">
              Structured preparation for Pakistan&apos;s major entry tests. Choose your course and start studying smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* ETEA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-40px" }}
              className="group bg-[#0a1a3a]/80 border border-[#7BBFFF]/15 rounded-2xl p-8 hover:border-[#7BBFFF]/35 hover:shadow-[0_0_32px_-8px_rgba(123,191,255,0.2)] transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7BBFFF]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#7BBFFF]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-7 h-7 text-[#7BBFFF]" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#F2FDFF] mb-2">ETEA</h3>
                <p className="text-sm text-[#7BBFFF] font-medium mb-4">Educational Testing &amp; Evaluation Agency (KPK)</p>
                <p className="text-[#99b3cc] text-base leading-relaxed mb-6">
                  ETEA is Khyber Pakhtunkhwa&apos;s official testing body. It conducts <strong className="text-[#F2FDFF]/90">MDCAT</strong>, <strong className="text-[#F2FDFF]/90">ECAT</strong> (engineering), teaching recruitment, and government recruitment tests. Engineering tests: 200 MCQs, 3 hours, with negative marking.
                </p>
                <ul className="space-y-2 text-sm text-[#B0C8E0]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7BBFFF]" />
                    Medical &amp; engineering entry tests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7BBFFF]" />
                    Teaching &amp; govt recruitment exams
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7BBFFF]" />
                    Online registration via ETEA portal
                  </li>
                </ul>
                <Button className="mt-6 w-full sm:w-auto bg-[#7BBFFF]/20 text-[#7BBFFF] hover:bg-[#7BBFFF]/30 border border-[#7BBFFF]/30" asChild>
                  <a href="https://etea.edu.pk" target="_blank" rel="noopener noreferrer">
                    Official site <ChevronRight className="w-4 h-4 inline ml-1" />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* NMDCAT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-40px" }}
              className="group bg-[#0a1a3a]/80 border border-[#B8A9FF]/15 rounded-2xl p-8 hover:border-[#B8A9FF]/35 hover:shadow-[0_0_32px_-8px_rgba(184,169,255,0.2)] transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8A9FF]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#B8A9FF]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-7 h-7 text-[#B8A9FF]" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#F2FDFF] mb-2">NMDCAT</h3>
                <p className="text-sm text-[#B8A9FF] font-medium mb-4">National Medical &amp; Dental College Admission Test</p>
                <p className="text-[#99b3cc] text-base leading-relaxed mb-6">
                  NMDCAT (also called MDCAT) is the national entrance exam for <strong className="text-[#F2FDFF]/90">MBBS</strong> and <strong className="text-[#F2FDFF]/90">BDS</strong> in Pakistan, conducted by PM&amp;DC. Format: 180 MCQs (Biology, Chemistry, Physics, English, Logical Reasoning), 3 hours, no negative marking. Minimum 55% for medical and 50% for dental colleges.
                </p>
                <ul className="space-y-2 text-sm text-[#B0C8E0]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8A9FF]" />
                    Biology, Chemistry, Physics, English, Logic
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8A9FF]" />
                    Mandatory for MBBS/BDS admission
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8A9FF]" />
                    Register at mdcat.pmdc.pk
                  </li>
                </ul>
                <Button className="mt-6 w-full sm:w-auto bg-[#B8A9FF]/20 text-[#B8A9FF] hover:bg-[#B8A9FF]/30 border border-[#B8A9FF]/30" asChild>
                  <a href="https://mdcat.pmdc.pk" target="_blank" rel="noopener noreferrer">
                    Official site <ChevronRight className="w-4 h-4 inline ml-1" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-[#050F2A] via-[#060b1a] to-[#050F2A] relative overflow-hidden px-4 sm:px-6"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[#7BBFFF]/6 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[#B8A9FF]/6 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative z-10 w-full">
          <h2 id="testimonials-heading" className="text-2xl xs:text-3xl sm:text-5xl font-display font-bold text-center mb-12 sm:mb-20 text-[#F2FDFF]">
            Trusted by <span className="text-[#7BBFFF]">Top Performers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                viewport={{ once: true, margin: "-40px" }}
                className="bg-[#0a1a3a]/40 backdrop-blur-sm border border-[#7BBFFF]/15 p-8 rounded-2xl relative hover:border-[#7BBFFF]/25 hover:shadow-[0_0_30px_-8px_rgba(123,191,255,0.1)] transition-all duration-300"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F2FDFF]/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[#F2FDFF]/90 mb-6 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <div className="font-bold text-lg text-[#F2FDFF]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#7BBFFF]">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="contact" aria-labelledby="contact-heading" className="py-14 sm:py-20 md:py-28 bg-[#050F2A] relative px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
          <div className="bg-gradient-to-br from-[#0a1a3a] to-[#0a1a3a]/60 border border-[#7BBFFF]/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden relative shadow-[0_0_60px_-20px_rgba(123,191,255,0.08)]">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#7BBFFF]/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B8A9FF]/10 rounded-full blur-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 relative z-10">
              <div>
                <h2 id="contact-heading" className="text-3xl md:text-4xl font-display font-bold mb-6 text-[#F2FDFF]">
                  Ready to start your journey?
                </h2>
                <p className="text-[#99b3cc] mb-8 text-lg leading-relaxed">
                  Join thousands of students achieving their dreams with
                  Prepzy. Have questions? Drop us a message.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#F2FDFF]/80 flex-wrap">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#7BBFFF]/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="break-all">support@prepzy.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F2FDFF]/80 flex-wrap">
                    <div className="w-10 h-10 rounded-full bg-[#7BBFFF]/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span>Khanpur Rd, Mang</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#050F2A]/50 p-6 sm:p-8 rounded-2xl border border-[#7BBFFF]/15 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#F2FDFF]/90 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-[#7BBFFF]/5 border-[#7BBFFF]/20 focus:border-[#7BBFFF]/50 text-[#F2FDFF]"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#F2FDFF]/90 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-[#7BBFFF]/5 border-[#7BBFFF]/20 focus:border-[#7BBFFF]/50 text-[#F2FDFF]"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#F2FDFF]/90 mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      className="bg-[#7BBFFF]/5 border-[#7BBFFF]/20 focus:border-[#7BBFFF]/50 min-h-[120px] text-[#F2FDFF]"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 rounded-xl font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
