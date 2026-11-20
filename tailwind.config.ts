import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 35px rgba(42, 48, 75, 0.08)"
      }
    }
  },
  plugins: []
};
export default config;
