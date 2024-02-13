import type { Config } from 'tailwindcss';
import defaultThema from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      minHeight: {
        screen: '100dvh',
      },
      height: {
        screen: '100dvh',
      },
      minWidth: {
        screen: '100dvw',
      },
      width: {
        screen: '100dvw',
      },
      animation: {
        'slide-out-fwd-center': 'slide-out-fwd-center 0.7s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both',
      },
      keyframes: {
        'slide-out-fwd-center': {
          '0%': {
            transform: 'translateZ(1)',
            opacity: '1',
          },
          to: {
            transform: 'translateZ(600px)',
            opacity: '0',
          },
        },
      },
    },
    fontFamily: {
      serif: ['var(--font-serif)', ...defaultThema.fontFamily.serif],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
