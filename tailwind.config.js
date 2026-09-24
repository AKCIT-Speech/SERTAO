/** @type {import('tailwindcss').Config} */

/**
 * Colour tokens resolve to CSS variables defined in src/index.css, so the same
 * utility classes serve both themes:
 *
 *   ink-950 / 900 / 800 / 700 → surface scale, darkest-to-lightest in dark mode
 *                               and lightest-to-white in light mode
 *   paper                     → primary text
 *   muted                     → secondary text
 *   faint                     → tertiary text (hints, counters)
 *   line                      → borders and dividers
 *
 * Variables hold space-separated RGB channels so Tailwind's opacity modifiers
 * (bg-ink-800/50) keep working.
 */
const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: withAlpha('--c-ink-950'),
          900: withAlpha('--c-ink-900'),
          800: withAlpha('--c-ink-800'),
          700: withAlpha('--c-ink-700'),
        },
        line: withAlpha('--c-line'),
        paper: withAlpha('--c-paper'),
        muted: withAlpha('--c-muted'),
        faint: withAlpha('--c-faint'),
        // Brand hues, identical in both themes; used for fills and accents.
        emotion: {
          angry: '#E45756',
          disgust: '#8C7650',
          fear: '#8067D8',
          happy: '#F2B84B',
          neutral: '#91A3A8',
          sad: '#4D7CFE',
          surprise: '#2FAE9B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
      },
      borderRadius: {
        // Deliberately tight radii: archival instrument panels, not SaaS cards.
        card: '3px',
        pill: '2px',
      },
      keyframes: {
        'bar-grow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bar-grow': 'bar-grow 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 420ms ease-out both',
      },
    },
  },
  plugins: [],
};
