import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        all: "0 0 8px rgba(156,163,175,0.5)", // Cria a classe shadow-all
      },
      keyframes: {
        loadingBar: {
          "0%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(70%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        loadingBar: "loadingBar 1.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        xconSky: "#C3EBFA",
        xconSkyLight: "#EDF9FD",
        xconPurple: "#A855F7",
        xconPurpleLight: "#F1F0FF",
        xconYellow: "#EAB308",
        xconYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
