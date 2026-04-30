import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wc: {
          ink: "#0B132B",
          deep: "#102542",
          gold: "#FFC83D",
          pitch: "#0E7C3A",
          magenta: "#E5006D",
          cyan: "#00B7E0",
          lime: "#C8FF1C",
          cobalt: "#1A4FFF",
          coral: "#FF5A3C",
          purple: "#7E3CFF",
          mint: "#34D6B6",
          cream: "#FFF6E5",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "system-ui", "sans-serif"],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        chunky: "6px 6px 0 0 rgba(11,19,43,1)",
        chunkySm: "3px 3px 0 0 rgba(11,19,43,1)",
      },
      animation: {
        "bounce-slow": "bounce 2.5s infinite",
        "spin-slow": "spin 8s linear infinite",
        "wiggle": "wiggle 1.5s ease-in-out infinite",
        "pop": "pop 0.4s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
