/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          600: "#2563eb",
          700: "#1e40af",
        },
        secondary: { 500: "#10b981" },
        accent: { 500: "#f59e0b" },
        surface: "#f8fafc",
        muted: "#6b7280",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
