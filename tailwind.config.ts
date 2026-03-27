import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#dbeafe',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          400: '#9ca3af',
          700: '#374151',
          900: '#111827',
        },
        success: '#10b981',
        error: '#ef4444',
        accent: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
