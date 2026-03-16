import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chl-dark': '#080808',
        'chl-card': '#111111',
        'chl-card-2': '#1A1A1A',
        'chl-border': '#222222',
        'chl-teal': '#00BFA5',
        'chl-teal-light': '#00D4B8',
        'chl-teal-dim': '#00BFA520',
        'chl-muted': '#888888',
        'chl-muted-2': '#555555',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-teal': 'pulseTeal 2s ease-in-out infinite',
        'score-fill': 'scoreFill 1.2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseTeal: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 191, 165, 0.3)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0, 191, 165, 0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
