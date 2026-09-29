import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm:   "640px",
        md:   "768px",
        lg:   "1024px",
        xl:   "1200px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans:    ["Manrope", "system-ui", "sans-serif"],
        serif:   ["Manrope", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Editorial palette
        paper:      "hsl(var(--paper))",
        "paper-soft": "hsl(var(--paper-soft))",
        "paper-deep": "hsl(var(--paper-deep))",
        "plum-paper":   "hsl(var(--plum-paper))",
        "plum-paper-2": "hsl(var(--plum-paper-2))",
        bone:       "hsl(var(--bone))",
        ink:        "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        "ink-mute": "hsl(var(--ink-mute))",
        rule:       "hsl(var(--rule))",
        "rule-strong": "hsl(var(--rule-strong))",
        aubergine:  "hsl(var(--aubergine))",
        plum:       "hsl(var(--plum))",
        orchid:     "hsl(var(--orchid))",
        bloom:      "hsl(var(--bloom))",
        ember:      "hsl(var(--ember))",

        primary: {
          DEFAULT:     "hsl(var(--primary))",
          foreground:  "hsl(var(--primary-foreground))",
          glow:        "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:               "hsl(var(--sidebar-background))",
          foreground:            "hsl(var(--sidebar-foreground))",
          primary:               "hsl(var(--sidebar-primary))",
          "primary-foreground":  "hsl(var(--sidebar-primary-foreground))",
          accent:                "hsl(var(--sidebar-accent))",
          "accent-foreground":   "hsl(var(--sidebar-accent-foreground))",
          border:                "hsl(var(--sidebar-border))",
          ring:                  "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        // Editorial display scale — fluid, generous
        "display-xl": ["clamp(3.5rem, 8vw, 8rem)",   { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 6rem)",  { lineHeight: "1.0",  letterSpacing: "-0.03em"  }],
        "display":    ["clamp(2.25rem, 5vw, 4.5rem)",{ lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(1.875rem, 3.5vw, 3rem)",{ lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "kicker":     ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) forwards",
        "fade-in":        "fade-in 0.5s ease-out forwards",
        marquee:          "marquee 38s linear infinite",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
