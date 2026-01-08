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
        // macOS 风格暖色系
        macos: {
          bg: {
            primary: '#FFFAF0',      // 主背景：温暖米白
            secondary: '#FFFBF7',    // 次级背景
            sidebar: '#FFFBF0',      // 侧边栏背景
            card: '#FFFFFF',         // 卡片背景
          },
          border: '#E5E5E0',         // 暖灰色边框
          text: {
            primary: '#1F2937',      // 主文本（替代 #111827）
            secondary: '#374151',    // 次级文本
            muted: '#6B7280',        // 弱化文本
          },
          // 保持现有暖色系
          accent: {
            coral: '#FF6B6B',
            apricot: '#FFB347',
            mint: '#6BCB77',
          }
        },
        // Warm color system for patient-friendly UI
        medical: {
          primary: '#FF6B6B',      // Warm Coral - main actions, headers
          secondary: '#FFB347',    // Warm Apricot - charts, accents
          accent: '#FFD93D',       // Warm Gold - success states
          success: '#6BCB77',      // Warm Mint - positive indicators
          warning: '#FFA94D',      // Warm Orange - warnings
          danger: '#FF6B6B',       // Warm Red - critical alerts
          info: '#4ECDC4',         // Warm Teal - informational
        },
        // Warm background tints
        warm: {
          50: '#FFF5F5',   // Very light coral
          100: '#FFEBEB',
          200: '#FFD4D4',
          300: '#FFBDBD',
          400: '#FF8787',
          500: '#FF6B6B',  // Primary warm
          600: '#FF5252',
          700: '#FF3D3D',
        }
      },
      borderRadius: {
        'macos': '6px',              // macOS 风格小圆角
        'macos-lg': '8px',
      },
      boxShadow: {
        'macos': '0 1px 3px rgba(0, 0, 0, 0.05)',  // 轻微阴影
        'macos-lg': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        'sidebar': '260px',          // 侧边栏宽度
        'sidebar-collapsed': '72px', // 折叠后的侧边栏宽度（仅图标）
      }
    },
  },
  plugins: [],
}
export default config
