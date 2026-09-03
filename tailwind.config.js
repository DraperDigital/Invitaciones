/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Official Invitto Brand Color Palette (from Logo)
                brand: {
                    DEFAULT: "#DF3B94",
                    dark: "#C52A7C",
                    light: "#FDF2F8",
                    hover: "#C52A7C",
                    navy: "#222B38",
                    yellow: "#F5B837",
                    green: "#4E7B55",
                },

                // Festive Celebration Accents (Matching official logo tones)
                festive: {
                    coral: "#FF6B6B",
                    lavender: "#9F7AEA",
                    mint: "#4E7B55",
                    yellow: "#F5B837",
                    pink: "#DF3B94",
                },

                // Legacy & Primary text
                primary: "#222B38", // Official Dark Navy Graphite Text
                secondary: "#334155",
                // Dynamic accent — driven by --color-accent CSS variable (set per theme in InvitationPage)
                // Use rgb() wrapper so Tailwind opacity modifiers work: text-accent/60
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                'accent-light': "rgba(var(--color-accent) / 0.12)",
                'accent-dark': "rgba(var(--color-accent) / 0.85)",

                cream: "#FFFFFF", // Pure white
                sand: "#F8F9FA", // Soft SaaS gray
                slate: {
                    50: "#F8F9FA",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#334155",
                    800: "#222B38",
                    900: "#171E28",
                },
                stone: {
                    50: "#fafafa",
                    100: "#f5f5f5",
                    200: "#e5e5e5",
                    300: "#d4d4d4",
                    400: "#a3a3a3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#262626",
                    900: "#1a1a1a",
                    950: "#0a0a0a"
                }
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
                serif: 'var(--font-serif)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
