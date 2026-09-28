import type { Config } from 'tailwindcss';

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.{js,ts,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50, #eff6ff)',
          100: 'var(--brand-100, #dbeafe)',
          200: 'var(--brand-200, #bfdbfe)',
          300: 'var(--brand-300, #93c5fd)',
          400: 'var(--brand-400, #60a5fa)',
          500: 'var(--brand-500, #3b82f6)',
          600: 'var(--brand-600, #2563eb)',
          700: 'var(--brand-700, #1d4ed8)',
          800: 'var(--brand-800, #1e40af)',
          900: 'var(--brand-900, #1e3a8a)',
          950: 'var(--brand-950, #172554)',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
