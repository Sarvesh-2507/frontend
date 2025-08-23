/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-xs': '0 2px 9px 0 rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 5px 13px 0 rgba(0, 0, 0, 0.09)',
        'soft-md': '0 8px 26px 0 rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 15px 35px 0 rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 20px 40px 0 rgba(0, 0, 0, 0.1)',
        'soft-2xl': '0 25px 50px 0 rgba(0, 0, 0, 0.15)',
        'soft-3xl': '0 35px 60px 0 rgba(0, 0, 0, 0.2)',
        'soft-inset': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-dark-xs': '0 2px 9px 0 rgba(255, 255, 255, 0.05)',
        'soft-dark-sm': '0 5px 13px 0 rgba(255, 255, 255, 0.09)',
        'soft-dark-md': '0 8px 26px 0 rgba(255, 255, 255, 0.12)',
        'soft-dark-lg': '0 15px 35px 0 rgba(255, 255, 255, 0.1)',
        'soft-dark-xl': '0 20px 40px 0 rgba(255, 255, 255, 0.1)',
        'soft-dark-2xl': '0 25px 50px 0 rgba(255, 255, 255, 0.15)',
        'soft-dark-3xl': '0 35px 60px 0 rgba(255, 255, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'soft-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -5px, 0)' },
          '70%': { transform: 'translate3d(0, -3px, 0)' },
          '90%': { transform: 'translate3d(0, -1px, 0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
