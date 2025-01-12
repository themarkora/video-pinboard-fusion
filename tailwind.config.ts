import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          top: "#10111C",
          bottom: "#492A81",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9334E9",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#2A2F3C",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#374151",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#6D28D9",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#2A2F3C",
          foreground: "#ffffff",
        },
        toast: {
          DEFAULT: "rgba(26, 31, 46, 0.8)",
          destructive: "rgba(26, 31, 46, 0.8)",
          success: "rgba(26, 31, 46, 0.8)",
        }
      },
      keyframes: {
        "float-pin": {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(45deg)" },
          "100%": { transform: "translateY(0) rotate(90deg)" },
        },
      },
      animation: {
        "float-pin": "float-pin 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;