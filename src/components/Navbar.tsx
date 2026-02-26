"use client";

import { Menu, X, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { DiagnosticForm } from "./DiagnosticForm";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  
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
            onClick={() => setDiagnosticOpen(true)}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-5 xl:px-6 py-2.5 xl:py-3 text-sm xl:text-base shadow-lg shadow-primary/25 whitespace-nowrap"
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
                    className="w-full py-4 px-6 rounded-full font-bold text-lg text-[#050F2A] bg-[#7BBBFF] hover:bg-[#7BBBFF]/90 active:scale-95 transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 24px rgba(123, 187, 255, 0.4), 0 2px 8px rgba(123, 187, 255, 0.3)'
                    }}
                    onClick={() => {
                      setIsOpen(false);
                      setDiagnosticOpen(true);
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

      <DiagnosticForm isOpen={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
    </nav>
  );
}