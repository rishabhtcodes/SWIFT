"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: "#08080A",
                    900: "#0B0B0E",
                    850: "#101014",
                    800: "#15151A",
                    700: "#1C1C22",
                    600: "#26262E",
                },
                graphite: {
                    500: "#3A3A44",
                    400: "#52525E",
                    300: "#6E6E7A",
                },
                amber: {
                    400: "#F5A524",
                    500: "#F08C00",
                    600: "#D97706",
                },
                warm: {
                    orange: "#FF7A1A",
                    soft: "#FFB366",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
            boxShadow: {
                glow: "0 0 40px -10px rgba(245, 165, 36, 0.35)",
                glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};
