/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B2447", // Deep Navy
        secondary: "#19376D", // Rich Blue
        accent: "#57C5B6", // Mint/Teal Accent
        success: "#059669", // Emerald-600
        warning: "#D97706", // Amber-600
        danger: "#DC2626", // Red-600
        background: "#F5F7FA", // Soft Bespoke Gray
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(11, 36, 71, 0.05)',
        panel: '0 8px 30px rgba(11, 36, 71, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        blob: "blob 7s infinite",
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(28px, -48px) scale(1.08)" },
          "66%": { transform: "translate(-18px, 18px) scale(0.94)" },
        },
      },
    },
  },
  plugins: [],
}
