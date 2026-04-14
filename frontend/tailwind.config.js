/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        night: { 50: "#f0f1f5", 100: "#d0d3e0", 200: "#a0a8c0", 300: "#6070a0", 400: "#3a4a7a", 500: "#1e2a4a", 600: "#16203a", 700: "#101828", 800: "#0a1020", 900: "#050810" },
        brand: { 400: "#4f8eff", 500: "#2563eb", 600: "#1d4ed8" },
        eco: "#22c55e", sport: "#f97316", safe: "#60a5fa", balanced: "#a78bfa",
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fadeIn 0.3s ease",
        "pulse-dot": "pulseDot 2s infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        slideUp: { from: { transform: "translateY(100%)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseDot: { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.5)", opacity: 0.5 } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
}
