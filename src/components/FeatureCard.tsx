"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group p-6 rounded-2xl glass-card hover:border-primary/50 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-[#F2FDFF]" />
        </div>

        <h3 className="text-xl font-display font-bold  mb-2 group-hover:text-primary transition-colors text-[#F2FDFF]">
          {title}
        </h3>

        <p className=" leading-relaxed text-[#F2FDFF]">{description}</p>
      </div>
    </motion.div>
  );
}
