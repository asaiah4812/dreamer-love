import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'love-primary': 'var(--color-love-primary)',
        'love-secondary': 'var(--color-love-secondary)',
        'love-accent': 'var(--color-love-accent)',
        'love-dark': 'var(--color-love-dark)',
        'love-light': 'var(--color-love-light)',
      },
    },
  },
  plugins: [],
}

export default config