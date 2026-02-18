/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#F3E8FF',
                    DEFAULT: '#6D28D9',
                    dark: '#5B21B6',
                },
                // Keeping these as generic fallbacks if needed, or mapping them
                primary: '#6D28D9',
                secondary: '#F3E8FF',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
