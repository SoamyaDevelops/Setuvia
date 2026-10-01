/** Setuvia Tailwind config - Paper & Ink */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: { DEFAULT: "var(--surface)", alt: "var(--surface-alt)" },
        line: { DEFAULT: "var(--line)", strong: "var(--line-strong)" },
        ink: { DEFAULT: "var(--ink)", muted: "var(--ink-muted)", faint: "var(--ink-faint)" },
        accent: { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", soft: "var(--accent-soft)" },
        clay: { DEFAULT: "var(--clay)", soft: "var(--clay-soft)" },
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
        danger: { DEFAULT: "var(--danger)", soft: "var(--danger-soft)" },
        info: { DEFAULT: "var(--info)", soft: "var(--info-soft)" },
        ch: { whatsapp: "var(--ch-whatsapp)", email: "var(--ch-email)", web: "var(--ch-web)" },
      },
      fontFamily: {
        display: ["Newsreader", "Noto Serif Devanagari", "Georgia", "serif"],
        sans: ["Public Sans", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: { sm: "6px", md: "8px" },
      boxShadow: { pop: "var(--shadow-pop)" },
      fontSize: { xs: ["12px", "16px"], sm: ["13px", "18px"], base: ["14px", "21px"], md: ["16px", "24px"] },
    },
  },
  plugins: [],
};
