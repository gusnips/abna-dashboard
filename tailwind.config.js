/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ABNA Brand Colors
                'abna-primary': '#1E40AF', // Blue
                'abna-secondary': '#059669', // Green
                'abna-accent': '#DC2626', // Red
                'abna-warning': '#F59E0B', // Amber

                // Chart Colors
                'chart-blue': '#3B82F6',
                'chart-green': '#10B981',
                'chart-yellow': '#FBBF24',
                'chart-orange': '#F97316',
                'chart-purple': '#8B5CF6',
                'chart-pink': '#EC4899',
                'chart-teal': '#14B8A6',
                'chart-indigo': '#6366F1',
            },
        },
    },
    plugins: [],
}
