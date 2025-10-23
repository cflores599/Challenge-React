/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#7E1E9B",
        brandLight: "#A64FC2",
        border: "#E5E7EB",
        bgLight: "#F9FAFB",
      },
      boxShadow: {
        card: "0 2px 8px rgba(16,24,40,0.04)",
        soft: "0 6px 18px rgba(16,24,40,0.06)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
        ],
      },
    },
  },
  plugins: [],
};
