import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: [
          "Poppins",
          "Inter",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
        inter: ["Inter", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
      },
      colors: {
        blue: {
          800: "#1e40af",
          900: "#1e3a8a",
        },
        orange: {
          500: "#f97316",
          600: "#ea580c",
        },
        // Custom colors from Figma design
        primary: "#001A96",
        greyBlueLight: "#F9F9FD",
        faqBackground: "#FBFCFD",
        greyBorder: "#E6E7ED",
        textDark: "#171D23",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
