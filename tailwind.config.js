/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C5DFA',
          hover: '#9277FF',
        },
        'status-paid': '#33D69F',
        'status-pending': '#FF8F00',
        'status-draft-dark': '#DFE3FA',
        'delete': '#EC5757',
        'delete-hover': '#FF9797',
        // Light mode
        'bg-light': '#F8F8FB',
        'card-light': '#FFFFFF',
        'sidebar-light': '#373B53',
        // Dark mode
        'bg-dark': '#141625',
        'card-dark': '#1E2139',
        'sidebar-dark': '#252945',
        'sidebar-nav': '#1E2139',
        // Text
        'text-dark': '#0C0E16',
        'text-light': '#FFFFFF',
        'text-muted': '#888EB0',
        'text-purple': '#7E88C3',
        'text-label': '#7E88C3',
      },
      fontFamily: {
        sans: ['League Spartan', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 10px 10px -10px rgba(72, 84, 159, 0.100397)',
        'card-dark': '0px 10px 10px -10px rgba(0,0,0,0.25)',
      },
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [],
}
