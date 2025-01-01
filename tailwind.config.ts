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
        // Add your custom colors here
      },
      fontFamily: {
        // Add your custom font families here
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
