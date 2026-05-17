/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F9A11B',   // COLORS.orange
          blue: '#050B18',   // COLORS.navy
          blueMid: '#1A2540',   // COLORS.navyMid
          light: '#EDF3FF',   // COLORS.blueLight
        },
      },

      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'],
        body:    ['Oswald', 'sans-serif'],
      },
    },
  },

  plugins: [],
}