export const theme = {
  colors: {
    // Dominant Primary Accent (Cyan)
    primary: {
      DEFAULT: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.4)',
      border: 'rgba(56, 189, 248, 0.3)',
      bgSoft: 'rgba(56, 189, 248, 0.1)',
    },
    // Rare Highlight (Monarch Purple)
    monarch: {
      DEFAULT: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
      border: 'rgba(168, 85, 247, 0.3)',
      bgSoft: 'rgba(168, 85, 247, 0.1)',
    },
    // Locked Neutral Grayscale
    gray: {
      950: '#030509', // App background
      900: '#090d16', // Card background
      850: '#0f172a', // Hover panel
      800: '#1f2937', // Borders
      500: '#6b7280', // Subtext / Muted
      300: '#d1d5db', // Body text
      50: '#ffffff',  // Primary headers
    },
    // Functional Status Colors
    status: {
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
    },
  },
  typography: {
    fonts: {
      logo: 'Orbitron, sans-serif',
      heading: 'Rajdhani, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'Courier New, monospace',
    },
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
  },
  shadows: {
    hudCard: '0 0 24px -6px rgba(56, 189, 248, 0.25)',
    hudModal: '0 0 50px rgba(56, 189, 248, 0.4)',
    hudFloat: '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
  },
} as const
