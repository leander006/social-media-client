/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 8 row grid
        8: "repeat(auto-fill, 250px)",
      },
      gridAutoRows: {
        "2fr": "10px",
      },
    },
  },
  plugins: [],
};
