/** @type {import('tailwindcss').Config} */
const { COLORS } = require("./theme/tokens.js");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // hoặc "class" nếu muốn tự toggle
  theme: {
    extend: {
      colors: COLORS,
    },
  },
  plugins: [],
};
