
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        run: "#FF4500",
        read: "#004080",
        borderNeutral: "#CCCCCC",
        errorRed: "#D93025",
      },
      fontFamily: {
        run: ["Oswald", "Impact", "system-ui", "sans-serif"],
        read: ["Merriweather", "Georgia", "serif"],
      },
      boxShadow: { lounge: "0 8px 30px rgba(0,0,0,0.08)" },
      backgroundImage: {
        'read-paper': "linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05)), repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)",
      },
      keyframes: { pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.7' } } },
      animation: { pulseSoft: 'pulseSoft 3s ease-in-out infinite' }
    },
  },
  plugins: [],
}
