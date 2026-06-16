/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        kiln: {
          50: "#FDF5F2",
          100: "#FAE8E1",
          200: "#F3C8B9",
          300: "#E99E85",
          400: "#DC6B4A",
          500: "#C8381F",
          600: "#A82A16",
          700: "#872114",
          800: "#6B1C14",
          900: "#581914",
        },
        gold: {
          50: "#FBF7EF",
          100: "#F5EBD5",
          200: "#EAD5A6",
          300: "#DFBA72",
          400: "#D4A547",
          500: "#C88F2A",
          600: "#A87120",
          700: "#87581C",
          800: "#6E481C",
          900: "#5C3D1C",
        },
        industrial: {
          50: "#F8F6F3",
          100: "#EDEAE4",
          200: "#D8D3C8",
          300: "#B5AD9C",
          400: "#8B8171",
          500: "#6B6255",
          600: "#554E44",
          700: "#453F38",
          800: "#374151",
          900: "#1A1D21",
        },
      },
      fontFamily: {
        display: ['"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(26, 29, 33, 0.06), 0 1px 3px rgba(26, 29, 33, 0.04)",
        "card-hover": "0 8px 24px rgba(26, 29, 33, 0.10), 0 2px 6px rgba(26, 29, 33, 0.06)",
        glow: "0 0 20px rgba(200, 56, 31, 0.30)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
