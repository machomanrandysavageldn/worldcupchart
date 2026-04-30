"use client";
import { motion } from "framer-motion";

export function Mascot({ size = 96 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      initial={{ rotate: -6 }}
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      aria-label="Footy mascot"
    >
      <defs>
        <radialGradient id="ballShine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#FFF6E5" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#ballShine)" stroke="#0B132B" strokeWidth="4" />
      {/* hexagon panels */}
      <polygon points="60,30 75,40 70,58 50,58 45,40" fill="#0B132B" />
      <polygon points="30,60 42,52 50,62 42,76 30,72" fill="#0B132B" />
      <polygon points="90,60 78,52 70,62 78,76 90,72" fill="#0B132B" />
      <polygon points="60,90 75,82 70,72 50,72 45,82" fill="#0B132B" />
      {/* eyes */}
      <circle cx="50" cy="55" r="5" fill="#fff" />
      <circle cx="70" cy="55" r="5" fill="#fff" />
      <circle cx="51" cy="56" r="2.5" fill="#0B132B" />
      <circle cx="71" cy="56" r="2.5" fill="#0B132B" />
      {/* smile */}
      <path d="M48 68 Q60 80 72 68" stroke="#E5006D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}
