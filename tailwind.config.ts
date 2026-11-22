import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F766E",
          hover: "#115E59",
          light: "#CCFBF1",
          accent: "#14B8A6",
          glow: "#2DD4BF",
        },
        surface: {
          // Light theme
          bg: "#F5F7FA",
          sidebar: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E2E8F0",
          muted: "#F1F5F9",
          text: "#172033",
          subtext: "#64748B",
          // Dark theme
          darkBg: "#0B1220",
          darkSidebar: "#111827",
          darkCard: "#172033",
          darkBorder: "#263449",
          darkText: "#F8FAFC",
          darkSubtext: "#94A3B8",
        },
        risk: {
          low: "#10B981",       // Green
          moderate: "#F59E0B",  // Yellow
          high: "#F97316",      // Orange
          veryhigh: "#EF4444",  // Red
          critical: "#991B1B",  // Dark Red
        },
      },
      fontFamily: {
        sans: [
          '"Schibsted Grotesk"',
          '"Noto Sans Sinhala"',
          '"Noto Sans Tamil"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        cardHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        glowBrand: "0 0 15px -3px rgba(20, 184, 166, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
