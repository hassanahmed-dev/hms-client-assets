import type { Config } from "tailwindcss";
const c = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: c("background"), surface: c("surface"), card: c("card"), line: c("line"),
        foreground: c("foreground"), muted: c("muted"), primary: c("primary"), secondary: c("secondary"),
        accent: c("accent"), ink: c("ink"), success: c("success"),
      },
      fontFamily: { display: ["var(--font-display)", "serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
      screens: { xs: "400px" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-reverse": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" }, "50%": { transform: "translate3d(0,-22px,0) rotate(6deg)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        pulseRing: { "0%": { transform: "scale(1)", opacity: "0.6" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--marquee-duration, 40s) linear infinite",
        "gradient-pan": "gradient-pan 10s ease infinite",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.2,0.6,0.4,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
