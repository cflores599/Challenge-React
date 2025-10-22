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
        card: "0 2px 4px rgba(0,0,0,0.05)",
        soft: "0 1px 3px rgba(0,0,0,0.04)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
