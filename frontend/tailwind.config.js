/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f0ff",
          violet: "#7000ff",
          green: "#00ff66",
        },
        dark: {
          900: "#0a0a0c",
          800: "#111116",
          700: "#1a1a22",
          600: "#252530",
          500: "#35354a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "typing": "typing 3.5s steps(40, end)",
        "blink": "blink 0.75s step-end infinite",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px rgba(0, 240, 255, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.2)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00f0ff" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
