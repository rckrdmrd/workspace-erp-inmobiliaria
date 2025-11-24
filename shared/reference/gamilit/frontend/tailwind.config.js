/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores principales (compatibilidad con componentes existentes)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },

        // Tema Detective - Colores principales (tonos completos)
        'detective-orange-300': '#fdba74',
        'detective-orange-400': '#fb923c',
        'detective-orange': '#f97316',
        'detective-orange-dark': '#ea580c',
        'detective-orange-700': '#c2410c',

        'detective-blue': '#1e3a8a',
        'detective-gold': '#f59e0b',

        // Fondos Detective
        'detective-bg': '#fffbeb',
        'detective-bg-secondary': '#fef3c7',

        // Texto Detective
        'detective-text': '#1f2937',
        'detective-text-secondary': '#6b7280',

        // Estados
        'detective-success': '#10b981',
        'detective-danger': '#ef4444',
        'detective-neutral': '#6b7280',

        // Borders
        'detective-border-light': '#f3f4f6',
        'detective-border-medium': '#e5e7eb',
        'detective-border-strong': '#d1d5db',

        // Rangos Maya - AJAW (Nivel 1 - Detective Novato)
        'rank-detective-from': '#60a5fa',
        'rank-detective-to': '#2563eb',

        // NACOM (Nivel 2 - Sargento)
        'rank-sargento-from': '#4ade80',
        'rank-sargento-to': '#16a34a',

        // AH K'IN (Nivel 3 - Teniente)
        'rank-teniente-from': '#fb923c',
        'rank-teniente-to': '#ea580c',

        // HALACH UINIC (Nivel 4 - Capitán)
        'rank-capitan-from': '#a78bfa',
        'rank-capitan-to': '#7c3aed',

        // K'UK'ULKAN (Nivel 5 - Comisario/Maestro)
        'rank-comisario-from': '#f59e0b',
        'rank-comisario-to': '#d97706',

        // Rareza de achievements
        'rarity-common': '#9ca3af',
        'rarity-rare': '#3b82f6',
        'rarity-epic': '#f97316',
        'rarity-legendary': '#f59e0b',
      },
      fontSize: {
        'detective-xs': ['0.75rem', { lineHeight: '1rem' }],
        'detective-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'detective-base': ['1rem', { lineHeight: '1.5rem' }],
        'detective-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'detective-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'detective-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'detective-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        'detective': '0 4px 14px 0 rgba(30, 58, 138, 0.25)',
        'detective-lg': '0 8px 20px 0 rgba(30, 58, 138, 0.3)',
        'gold': '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
        'gold-lg': '0 8px 20px 0 rgba(245, 158, 11, 0.3)',
        'orange': '0 4px 14px 0 rgba(249, 115, 22, 0.25)',
        'orange-lg': '0 8px 20px 0 rgba(249, 115, 22, 0.3)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px 0 rgba(0, 0, 0, 0.15)',
        'card-detective': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'card-detective-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        // Glow shadows
        'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-strong': '0 0 30px rgba(249, 115, 22, 0.5)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'gold-glow-strong': '0 0 30px rgba(245, 158, 11, 0.5)',
      },
      borderRadius: {
        'detective': '0.75rem',
        'detective-lg': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'detective-glow': 'detectiveGlow 2s ease-in-out infinite alternate',
        'gold-shine': 'goldShine 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        detectiveGlow: {
          '0%': { boxShadow: '0 0 5px rgba(30, 58, 138, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(30, 58, 138, 0.8)' },
        },
        goldShine: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.5)' },
          '50%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.8)' },
        },
        // Pulse animation for badges
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        // Bounce animation
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
