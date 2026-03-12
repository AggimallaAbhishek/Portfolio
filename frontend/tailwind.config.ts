import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      },
      colors: {
        night: "#08111f",
        mist: "#e6edf6",
        cyan: "#56d4dd",
        coral: "#ff8a65",
        sand: "#f6efe8"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(7, 21, 38, 0.25)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(86, 212, 221, 0.28), transparent 38%), radial-gradient(circle at top right, rgba(255, 138, 101, 0.22), transparent 30%), linear-gradient(135deg, rgba(8, 17, 31, 0.95), rgba(14, 29, 52, 0.88))"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: [typography]
} satisfies Config;
