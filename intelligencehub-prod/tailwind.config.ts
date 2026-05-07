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
        bg: {
          primary:   '#020508',
          secondary: '#0a0f1e',
          tertiary:  '#111827',
          card:      'rgba(7,17,38,0.75)',
        },
        brand: {
          blue:      '#3B82F6',
          blueDark:  '#2563EB',
          blueDeep:  '#1E40AF',
          yellow:    '#FFD700',
        },
        accent: {
          blue:   '#3B82F6',
          cyan:   '#39D2FF',
          green:  '#4ade80',
          purple: '#a78bfa',
          amber:  '#F59E0B',
          rose:   '#f87171',
        },
        neon: {
          green: '#4ade80',
          blue:  '#39D2FF',
        },
        text: {
          primary:   '#F1F5F9',
          secondary: '#94A3B8',
          muted:     '#475569',
        },
        border: {
          subtle: 'rgba(148,163,184,0.08)',
          medium: 'rgba(148,163,184,0.15)',
          active: 'rgba(59,130,246,0.3)',
          glow:   'rgba(59,130,246,0.25)',
        },
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        xl2:  '18px',
      },
      backgroundImage: {
        'gradient-neon':  'linear-gradient(135deg, #39D2FF, #3B82F6, #1E40AF)',
        'gradient-brand': 'linear-gradient(90deg, #39D2FF, #3B82F6)',
        'gradient-gold':  'linear-gradient(90deg, #FFD700, #F59E0B)',
        'gradient-card':  'linear-gradient(145deg, rgba(17,24,39,0.8) 0%, rgba(10,15,30,0.9) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
