import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBFBFA",
        surface: "#FFFFFF",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1d40af",
          800: "#1e3a8a",
          900: "#0f2b48",
          950: "#091a2c",
        },
        shield: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
        },
        payout: {
          50: "#ecfdf5",
          100: "#d1fae5",
          600: "#059669",
          700: "#047857",
        },
        alert: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        serious: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(15, 43, 72, 0.04), 0 10px 25px -5px rgba(15, 43, 72, 0.06)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 10px 20px -2px rgba(15, 43, 72, 0.04)",
        floating: "0 14px 34px -4px rgba(15, 43, 72, 0.12), 0 4px 12px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
