"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "/privacypolicy" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 lg:px-12">
      <div className="flex justify-between items-center">
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center group z-10">
          <img
            src="navimage.png"
            alt="Prepzy"
            className="h-15 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav - Center with curved design */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1 backdrop-blur-xl rounded-full px-8 py-3 shadow-2xl"
             style={{ 
               backgroundColor: '#050F2A',
               border: '1px solid #7BBBFF40',
               boxShadow: '0 8px 32px rgba(123, 187, 255, 0.15), 0 0 0 1px rgba(123, 187, 255, 0.1)'
             }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 relative group"
              style={{ color: '#F2FDFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7BBBFF20';
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

        {/* Login Button - Right Side */}
        <div className="hidden md:flex items-center z-10">
          <button
            onClick={() => window.location.href = "https://fypdashboard-aqq8.vercel.app/signin"}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-6 py-3 shadow-lg shadow-primary/25"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mt-4 mx-4">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-primary hover:bg-white/5 px-3 py-2 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <button className="w-full bg-primary text-primary-foreground font-bold rounded-full">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}