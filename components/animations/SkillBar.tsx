"use client";

import { motion } from "framer-motion";

interface Props {
  level: number;
  name: string;
  color?: string;
}

export default function SkillBar({ level, name, color = "#00f0ff" }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{name}</span>
        <span className="text-xs font-mono" style={{ color }}>
          {level}%
        </span>
      </div>
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 10px ${color}44`,
          }}
        >
          <div
            className="absolute right-0 top-0 h-full w-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
        </motion.div>
      </div>
    </div>
  );
}
