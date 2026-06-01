/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                // ABNA / NA brand — anchored on the Narcóticos Anônimos blue
                'abna-primary': '#1D4ED8',   // Brand blue
                'abna-primary-dark': '#1E3A8A',
                'abna-secondary': '#0E9F6E', // Supporting green
                'abna-accent': '#DC2626',    // Red (alerts)
                'abna-warning': '#F59E0B',   // Amber

                // Neutral canvas tuned with a cool/blue tint
                ink: {
                    50: '#f6f8fc',
                    100: '#eef2f9',
                    200: '#e2e8f3',
                    300: '#cbd5e8',
                    400: '#94a3c4',
                    500: '#64749b',
                    600: '#475579',
                    700: '#374264',
                    800: '#212b45',
                    900: '#131a2e',
                },

                // Chart Colors — cohesive, slightly desaturated 2026 palette
                'chart-blue': '#3B82F6',
                'chart-green': '#10B981',
                'chart-yellow': '#FBBF24',
                'chart-orange': '#F97316',
                'chart-purple': '#8B5CF6',
                'chart-pink': '#EC4899',
                'chart-teal': '#14B8A6',
                'chart-indigo': '#6366F1',
            },
            boxShadow: {
                'soft': '0 1px 2px rgb(19 26 46 / 0.04), 0 4px 16px -4px rgb(19 26 46 / 0.08)',
                'soft-lg': '0 2px 4px rgb(19 26 46 / 0.04), 0 12px 32px -8px rgb(19 26 46 / 0.12)',
                'glow': '0 0 0 1px rgb(29 78 216 / 0.08), 0 10px 30px -10px rgb(29 78 216 / 0.35)',
            },
            backgroundImage: {
                // Header / primary field — locked to the NA blue family for a single, confident identity
                'brand-gradient': 'linear-gradient(120deg, #0C1E5B 0%, #15388F 42%, #1D4ED8 74%, #2C66F0 100%)',
                // Green is the supporting accent only — used for thin "signature" lines
                'accent-gradient': 'linear-gradient(90deg, #1D4ED8 0%, #1789C7 55%, #0E9F6E 100%)',
                'mesh': 'radial-gradient(at 0% 0%, rgb(29 78 216 / 0.10) 0px, transparent 50%), radial-gradient(at 98% 0%, rgb(14 159 110 / 0.08) 0px, transparent 45%), radial-gradient(at 50% 100%, rgb(99 102 241 / 0.06) 0px, transparent 55%)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            },
        },
    },
    plugins: [],
}
