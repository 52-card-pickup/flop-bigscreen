import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        watercourse: {
          "50": "#ebfef6",
          "100": "#d0fbe7",
          "200": "#a4f6d3",
          "300": "#6aebbd",
          "400": "#2fd8a1",
          "500": "#0abf8a",
          "600": "#009b71",
          "700": "#007357",
          "800": "#03624b",
          "900": "#04503f",
          "950": "#012d25",
        },
        mystic: {
          "50": "#f5f9fa",
          "100": "#e2ecf0",
          "200": "#d0e2e7",
          "300": "#a7c9d2",
          "400": "#77adb9",
          "500": "#5693a1",
          "600": "#437786",
          "700": "#37606d",
          "800": "#31515b",
          "900": "#2c454e",
          "950": "#1d2e34",
        },
      },
      animation: {
        "spin-bg-slow": "spin-bg 10s linear infinite",
      },
      keyframes: {
        "spin-bg": {
          "0%": { transform: "rotate(0deg) scale(2.83)" },
          "100%": { transform: "rotate(360deg) scale(2.83)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
