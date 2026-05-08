import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-card': '#fafafa',
        'surface-strong': '#ebebeb',
        'surface-dark': '#1a2129',
        'surface-dark-elevated': '#262e38',
        ink: '#262626',
        body: '#3c3c3c',
        'body-strong': '#1a1a1a',
        muted: '#6b6b6b',
        'muted-soft': '#9a9a9a',
        primary: {
          DEFAULT: '#1c69d4',
          foreground: '#ffffff',
        },
        'primary-active': '#0653b6',
        'primary-disabled': '#d6d6d6',
        'on-primary': '#ffffff',
        'on-dark': '#ffffff',
        'on-dark-soft': '#bbbbbb',
        hairline: '#e6e6e6',
        'hairline-strong': '#cccccc',
        'm-blue-light': '#0066b1',
        'm-blue-dark': '#1c69d4',
        'm-red': '#e22718',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#dc2626',
        // Shadcn mappings
        background: '#ffffff',
        foreground: '#262626',
        card: {
          DEFAULT: '#fafafa',
          foreground: '#262626',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#262626',
        },
        secondary: {
          DEFAULT: '#f7f7f7',
          foreground: '#262626',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        border: '#e6e6e6',
        input: '#e6e6e6',
        ring: '#1c69d4',
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '80px',
      },
      borderRadius: {
        lg: '0px',
        md: '0px',
        sm: '0px',
        none: '0px',
        xs: '2px',
        pill: '9999px',
        full: '9999px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
