/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        border: {
          primary: 'var(--border-primary)',
        },
        indigo: {
          600: '#4f46e5',
        },
        slate: {
          50: '#f8fafc',
          950: '#020617',
        },
        emerald: {
          500: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      },
      borderRadius: {
        '3xl': '24px',
      },
      backdropBlur: {
        'lg': '12px',
      }
    },
  },
  plugins: [],
}
