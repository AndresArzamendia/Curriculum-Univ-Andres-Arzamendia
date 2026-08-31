"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function GlowCard({ children, className = "" }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl glass p-6 transition-all duration-300 hover:glow-cyan group ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-neon-cyan/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
