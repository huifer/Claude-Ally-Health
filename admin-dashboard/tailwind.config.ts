import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: false, // Disabled - single theme only
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ========================================
         WARM GREEN HEALTHCARE PALETTE
         Complete scale from 50 to 950
         Hue: 142° (warm, yellow-tinted green)
         ======================================== */
        primary: {
          50: '#F0FDF4',   // hsl(142 50% 96%)
          100: '#DCFCE7',  // hsl(142 53% 91%)
          200: '#BBF7D0',  // hsl(143 55% 84%)
          300: '#86EFAC',  // hsl(142 60% 73%)
          400: '#4ADE80',  // hsl(142 71% 60%)
          500: '#22C55E',  // hsl(142 71% 45%) - Main secondary
          600: '#16A34A',  // hsl(142 76% 36%) - Main primary
          700: '#15803D',  // hsl(142 69% 28%) - Accent
          800: '#166534',  // hsl(142 67% 22%)
          900: '#14532D',  // hsl(143 75% 14%)
          950: '#052E16',  // hsl(144 75% 7%)
        },

        /* Semantic color aliases for better code readability */
        success: {
          DEFAULT: '#16A34A',  // Same as primary-600
          light: '#22C55E',    // Same as primary-500
          dark: '#15803D',     // Same as primary-700
        },

        warning: {
          DEFAULT: '#F59E0B',  // Amber 500
          light: '#FBBF24',    // Amber 400
          dark: '#D97706',     // Amber 600
        },

        info: {
          DEFAULT: '#06B6D4',  // Cyan 500
          light: '#22D3EE',    // Cyan 400
          dark: '#0891B2',     // Cyan 600
        },

        danger: {
          DEFAULT: '#EF4444',  // Red 500
          light: '#F87171',    // Red 400
          dark: '#DC2626',     // Red 600
        },

        /* Neutral grays with proper contrast */
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },

      /* Spacing scale for consistency */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      /* Border radius variants */
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      /* Animation utilities */
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 300ms ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
