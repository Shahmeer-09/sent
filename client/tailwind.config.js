import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'authpage': "url('./src/assets/authbg.jpg')",
        'mainicon': "url('./src/assets/mainicon.png')",
        'chatbg': "url('./src/assets/chatbg.jpg')",
      }
    },
  },
  plugins: [nextui()],
}

