/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ---- EDIT THESE TO RESTYLE THE WHOLE APP ----
      colors: {
        ink: {
          DEFAULT: '#294522', // sidebar / dark surfaces
          light: '#3C532D',
        },
        paper: '#F7F7E7', // main content background
        line: '#D9DDC8', // borders / dividers
        accent: {
          DEFAULT: '#8C8A3E', // primary brand accent (buttons, links, active states)
          dark: '#6A6D2F',
        },
        health: {
          green: '#55612D',
          amber: '#D4AF37',
          red: '#B84A3A',
        },
        // tinted backgrounds for the dashboard stat cards - one per metric
        tint: {
          blue: '#EEF1E6',
          green: '#E8EEDB',
          purple: '#F0ECDC',
          amber: '#FAF3D7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
