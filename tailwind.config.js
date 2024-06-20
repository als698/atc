/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      keyframes: {
        'fade-in-scale': {
          '0%': { opacity: 0, transform: 'scale(0.9)', filter: 'blur(10px)' },
          '100%': { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
        },
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
