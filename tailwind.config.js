/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAFAF7',
          dim: '#F1F0EA',
          line: '#E4E1D8',
        },
        ink: {
          DEFAULT: '#14171A',
          soft: '#4A4F55',
          faint: '#82878D',
        },
        full: {
          DEFAULT: '#2A5FE8',
          soft: '#E7EDFD',
          deep: '#1B3FA0',
        },
        linear: {
          DEFAULT: '#C7791A',
          soft: '#FBEFDD',
          deep: '#8F5710',
        },
        signal: {
          error: '#B3432E',
          errorSoft: '#F7E7E2',
          good: '#2F7A52',
          goodSoft: '#E4F2E9',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        pulseWrite: {
          '0%': { boxShadow: '0 0 0 0 rgba(199,121,26,0.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(199,121,26,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(199,121,26,0)' },
        },
      },
      animation: {
        pulseWrite: 'pulseWrite 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
