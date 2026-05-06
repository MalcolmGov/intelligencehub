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
        },
        accent: {
          blue:   '#3B82F6',
          cyan:   '#FACC15',
          green:  '#60A5FA',
          purple: '#2563EB',
          amber:  '#FACC15',
          rose:   '#F59E0B',
        },
        text: {
          primary:   '#F1F5F9',
          secondary: '#94A3B8',
          muted:     '#475569',
        },
        border: {
          subtle: 'rgba(148,163,184,0.08)',
          active: 'rgba(59,130,246,0.3)',
        },
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #FACC15, #3B82F6, #1E40AF)',
        'gradient-card': 'linear-gradient(145deg, rgba(17,24,39,0.8) 0%, rgba(10,15,30,0.9) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
