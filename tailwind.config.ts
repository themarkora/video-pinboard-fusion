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
          "0%": { 
            transform: "translateY(0) translateX(0) rotate(0deg)",
            opacity: "0"
          },
          "10%": {
            opacity: "0.08"
          },
          "33%": { 
            transform: "translateY(-50px) translateX(30px) rotate(180deg)",
            opacity: "0.08"
          },
          "66%": { 
            transform: "translateY(30px) translateX(-40px) rotate(360deg)",
            opacity: "0.08"
          },
          "90%": {
            opacity: "0.08"
          },
          "100%": { 
            transform: "translateY(0) translateX(0) rotate(720deg)",
            opacity: "0"
          },
        },
        "float-pin-1": {
          "0%": { 
            transform: "translateY(0) translateX(0) rotate(0deg)",
            opacity: "0"
          },
          "10%": {
            opacity: "0.08"
          },
          "33%": { 
            transform: "translateY(40px) translateX(-50px) rotate(240deg)",
            opacity: "0.08"
          },
          "66%": { 
            transform: "translateY(-25px) translateX(35px) rotate(480deg)",
            opacity: "0.08"
          },
          "90%": {
            opacity: "0.08"
          },
          "100%": { 
            transform: "translateY(0) translateX(0) rotate(720deg)",
            opacity: "0"
          },
        },
        "float-pin-2": {
          "0%": { 
            transform: "translateY(0) translateX(0) rotate(0deg)",
            opacity: "0"
          },
          "10%": {
            opacity: "0.08"
          },
          "33%": { 
            transform: "translateY(-35px) translateX(-35px) rotate(180deg)",
            opacity: "0.08"
          },
          "66%": { 
            transform: "translateY(45px) translateX(40px) rotate(360deg)",
            opacity: "0.08"
          },
          "90%": {
            opacity: "0.08"
          },
          "100%": { 
            transform: "translateY(0) translateX(0) rotate(720deg)",
            opacity: "0"
          },
        },
      },
      animation: {
        "float-pin": "float-pin-0 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;