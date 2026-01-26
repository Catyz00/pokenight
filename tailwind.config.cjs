/**
 * Tailwind configuration for PokeNight
 * Exposes project CSS variables as named color utilities so classes like
 * `text-pokenight-yellow` work without hardcoding colors in Tailwind.
 */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pokenight-yellow': 'var(--color-pokenight-yellow)',
        'pokenight-red': 'var(--color-pokenight-red)',
        'pokenight-text': 'var(--color-pokenight-text)',
        'pokenight-card': 'var(--color-pokenight-card)',
        'primary': 'var(--color-primary)',
        'foreground': 'var(--color-foreground)',
        'muted': 'var(--color-muted)',
        'chart-1': 'var(--color-chart-1)',
        'chart-2': 'var(--color-chart-2)',
        'chart-3': 'var(--color-chart-3)',
        'chart-4': 'var(--color-chart-4)',
        'chart-5': 'var(--color-chart-5)',
      },
    },
  },
  plugins: [],
};
