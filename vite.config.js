import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            },
            animation: {
              'fade-in': 'fadeIn 0.3s ease-in-out',
              'slide-up': 'slideUp 0.3s ease-in-out',
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              slideUp: {
                '0%': {
                  opacity: '0',
                  transform: 'translateY(20px)',
                },
                '100%': {
                  opacity: '1',
                  transform: 'translateY(0)',
                },
              },
            },
          },
        },
        plugins: [],
      },
    }),
  ],
});
