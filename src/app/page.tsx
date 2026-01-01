"use client";

import { Hero3D } from "@/components/Hero3D";
import { Navbar } from "@/components/Navbar";
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
    <div className="min-h-screen bg-[#050F2A] text-[#F2FDFF] overflow-x-hidden selection:bg-[#7BBFFF]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-0 px-4">
        <Hero3D />

        <div className="relative z-10 container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F2FDFF] via-[#5BA7FF] to-[#B8A9FF] drop-shadow-[0_0_30px_rgba(123,191,255,0.3)]">
              Crack Exams not <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BBFFF] to-[#B8A9FF] drop-shadow-[0_0_40px_rgba(184,169,255,0.4)]">
                Your brain
              </span>
            </h1>

            <p className="text-base xs:text-lg md:text-2xl text-[#B0C8E0] mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto font-light drop-shadow-[0_2px_10px_rgba(176,200,224,0.2)]">
              Smart plans, personalized study, and expert tools designed to help
              you achieve top results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-[#7BBFFF] text-[#050F2A] hover:bg-[#7BBFFF]/90 shadow-[0_0_30px_-5px_rgba(123,191,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(123,191,255,0.6)] transition-all duration-300"
              >
                Start Learning
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full bg-[#B8A9FF] glass-button text-[#050F2A] border-[#7BBFFF]/20 hover:bg-[#7BBFFF]/10 hover:text-[#7BBFFF]"
              >
                View Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Stats Section */}
      <section id="about" className="py-16 sm:py-24 bg-[#050F2A] relative px-6">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#7BBFFF]/10 to-transparent" />
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-[#F2FDFF]">
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
                  className="p-5 sm:p-8 rounded-2xl bg-[#0a1a3a] border border-[#7BBFFF]/10 text-center hover:border-[#7BBFFF]/30 transition-colors"
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
      <section id="features" className="py-16 sm:py-24 bg-[#050F2A]/50 relative px-4">
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-5xl font-display font-bold mb-4 text-[#F2FDFF]">
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
              <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-16 sm:py-24 bg-[#050F2A] relative overflow-hidden px-4"
      >
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7BBFFF]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#B8A9FF]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative z-10 w-full">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-display font-bold text-center mb-10 sm:mb-16 text-[#F2FDFF]">
            Trusted by <span className="text-[#7BBFFF]">Top Performers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#0a1a3a]/30 backdrop-blur-sm border border-[#7BBFFF]/10 p-8 rounded-2xl relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F2FDFF]/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-[#F2FDFF]/90 mb-6 italic leading-relaxed">
                 &quot; {testimonial.content}&quot;
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
      <section id="contact" className="py-16 sm:py-24 bg-[#050F2A] relative px-4">
        <div className="container max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0a1a3a] to-[#0a1a3a]/50 border border-[#7BBFFF]/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">
            {/* Decorative background circle */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#7BBFFF]/20 rounded-full blur-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-[#F2FDFF]">
                  Ready to start your journey?
                </h2>
                <p className="text-[#99b3cc] mb-8 text-lg">
                  Join thousands of students achieving their dreams with
                  ExamMaster. Have questions? Drop us a message.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#F2FDFF]/80">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span>support@prepzy.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[#F2FDFF]/80">
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

              <div className="bg-[#050F2A]/40 p-5 sm:p-8 rounded-2xl border border-[#7BBFFF]/10">
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
