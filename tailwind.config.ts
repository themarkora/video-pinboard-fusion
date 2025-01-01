import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
          top: "hsl(var(--background-top))",
          bottom: "hsl(var(--background-bottom))",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "float-pin-0": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "33%": { transform: "translateY(-30px) translateX(20px) rotate(45deg)" },
          "66%": { transform: "translateY(10px) translateX(-20px) rotate(90deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(360deg)" },
        },
        "float-pin-1": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "33%": { transform: "translateY(20px) translateX(-30px) rotate(120deg)" },
          "66%": { transform: "translateY(-15px) translateX(25px) rotate(240deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(360deg)" },
        },
        "float-pin-2": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "33%": { transform: "translateY(-25px) translateX(-25px) rotate(90deg)" },
          "66%": { transform: "translateY(20px) translateX(30px) rotate(180deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(360deg)" },
        },
      },
      animation: {
        "float-pin": "float-pin-0 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;