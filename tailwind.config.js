/** @type {import('tailwindcss').Config} */
const tokens = require("./theme/tokens.ts");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // hoặc "class" nếu muốn tự toggle
  theme: {
    extend: {
      colors: tokens.colors,
    },
  },
  plugins: [],
};
