/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#0066FF',
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D6C1FF',
          300: '#C2A3FF',
          400: '#AD85FF',
          500: '#7C3AED',
          600: '#6329BE',
          700: '#4A1F8E',
          800: '#32145F',
          900: '#190A2F',
        },
        accent: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Backgrounds
        background: {
          DEFAULT: '#FAFBFC',
          card: '#FFFFFF',
          sidebar: '#0F1419',
          secondary: '#F3F4F6',
        },
        // Text
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          white: '#FFFFFF',
        },
        // Borders
        border: {
          DEFAULT: '#E5E7EB',
          divider: '#F3F4F6',
        },
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'custom-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'custom-xl': '0 16px 48px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
