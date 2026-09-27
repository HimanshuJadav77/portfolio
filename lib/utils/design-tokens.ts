/**
 * Design System Tokens
 * "Cinematic Engineering OS" - Dark, precise, technical
 */

export const colors = {
  // Backgrounds
  background: '#0A0A0F',        // near-black
  backgroundElevated: '#111318', // charcoal
  surface: '#14171C',           // slightly lighter surface
  surfaceHover: '#1C1F26',      // hover state

  // Brand
  primary: '#00E5FF',           // electric cyan
  primaryDim: '#00B8CC',        // dimmed cyan
  primaryMuted: 'rgba(0, 229, 255, 0.1)',
  secondary: '#A855F7',         // violet
  secondaryMuted: 'rgba(168, 85, 247, 0.1)',

  // Text
  text: '#FAFAFA',              // high-contrast white
  textSecondary: '#A1A1AA',     // zinc-400
  textMuted: '#71717A',         // zinc-500
  textDim: '#52525B',           // zinc-600

  // Borders
  border: '#27272A',            // zinc-800
  borderHover: '#3F3F46',       // zinc-700
  borderFocus: '#00E5FF',       // primary

  // Status
  success: '#22C55E',           // green-500
  warning: '#F59E0B',           // amber-500
  error: '#EF4444',             // red-500
  info: '#3B82F6',              // blue-500

  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
  gradientMesh: 'radial-gradient(ellipse at 50% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
};

export const typography = {
  fontFamilies: {
    display: 'var(--font-space-grotesk)', // Space Grotesk
    body: 'var(--font-geist)',             // Geist
    mono: 'var(--font-geist-mono)',        // Geist Mono
  },
  fontSizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
    widest: '0.1em',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
  glow: '0 0 20px rgba(0, 229, 255, 0.15)',
  glowStrong: '0 0 40px rgba(0, 229, 255, 0.25)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  cinematic: '800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

export const motion = {
  durations: {
    fast: 150,
    normal: 250,
    slow: 350,
    cinematic: 800,
  },
  easings: {
    standard: [0.4, 0, 0.2, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    cinematic: [0.25, 0.46, 0.45, 0.94] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
  },
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndices = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
  cursor: 9999,
};

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  motion,
  breakpoints,
  zIndices,
};

export type DesignTokens = typeof designTokens;