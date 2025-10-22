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
    },
  },
  plugins: [],
}
