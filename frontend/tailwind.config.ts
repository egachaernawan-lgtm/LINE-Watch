import type { Config } from "tailwindcss";

// Every value comes from the LINE Watch design system tokens (see src/app/globals.css).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--line-green)",
          pressed: "var(--line-green-pressed)",
          tint: "var(--line-green-tint)",
          dark: "#05A648",
        },
        gray: {
          900: "var(--gray-900)",
          700: "var(--gray-700)",
          500: "var(--gray-500)",
          300: "var(--gray-300)",
          200: "var(--gray-200)",
          100: "var(--gray-100)",
        },
        error: { DEFAULT: "var(--red-500)", tint: "var(--red-tint)" },
        warning: { DEFAULT: "var(--orange-500)", tint: "var(--orange-tint)" },
        info: { DEFAULT: "var(--blue-500)", tint: "var(--blue-tint)" },
      },
      fontFamily: { sans: ["var(--font-sans)"] },
      borderRadius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px" },
      boxShadow: {
        sticky: "var(--shadow-sticky)",
        popover: "var(--shadow-popover)",
        modal: "var(--shadow-modal)",
      },
      transitionTimingFunction: { standard: "cubic-bezier(0.2,0,0,1)" },
    },
  },
  plugins: [],
};

export default config;
