import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        niuma: {
          bg: "#FCEAE4",
          bgSoft: "#F8D8CF",
          card: "#FFF8F3",
          primary: "#D95A4E",
          primaryDark: "#8B3A32",
          textMain: "#3B2A24",
          textSub: "#7A6258",
          green: "#5F7F4F",
          danger: "#D65A4A",
          border: "#EAC8BC",
        },
      },
      borderRadius: {
        "card-lg": "28px",
        "card": "24px",
        "card-sm": "20px",
        "btn": "22px",
        "pill": "999px",
      },
      boxShadow: {
        "niuma": "0 4px 16px rgba(120, 72, 60, 0.12)",
        "niuma-sm": "0 2px 8px rgba(120, 72, 60, 0.08)",
      },
      maxWidth: {
        "app": "430px",
      },
      spacing: {
        "page-x": "20px",
      },
    },
  },
};

export default config;
