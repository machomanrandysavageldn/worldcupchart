"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// Official 2026 World Cup mascots: Maple (Canada), Zayu (Mexico), Clutch (USA).
// User-supplied asset stored at public/fifa/newmascots.png (transparent bg).
export function Mascot({ size = 96 }: { size?: number }) {
  return (
    <motion.div
      initial={{ rotate: -3 }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      style={{ width: size, height: size }}
      className="relative"
      aria-label="2026 World Cup mascots"
    >
      <Image
        src="/fifa/newmascots.png"
        alt="World Cup 2026 mascots — Maple, Zayu and Clutch"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={size > 80}
      />
    </motion.div>
  );
}
