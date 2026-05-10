import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#22e0ff",
          violet: "#9b5cff",
          pink: "#ff3df0",
          dark: "#05050a",
          panel: "#0b0b14",
          line: "#1a1a2e",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 24px rgba(34,224,255,0.35), 0 0 48px rgba(155,92,255,0.25)",
        "neon-pink": "0 0 24px rgba(255,61,240,0.45)",
        "neon-cyan": "0 0 18px rgba(34,224,255,0.55)",
      },
      backgroundImage: {
        "grid-neon":
          "linear-gradient(rgba(34,224,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(155,92,255,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(80% 60% at 50% 0%, rgba(155,92,255,0.25) 0%, rgba(34,224,255,0.12) 35%, rgba(0,0,0,0) 70%)",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 6px #22e0ff)" },
          "50%": { opacity: "0.85", filter: "drop-shadow(0 0 14px #ff3df0)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.55" },
        },
      },
      animation: {
        pulseNeon: "pulseNeon 3.2s ease-in-out infinite",
        flicker: "flicker 6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
