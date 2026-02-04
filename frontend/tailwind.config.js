/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                chewy: ['Chewy', 'system-ui'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
