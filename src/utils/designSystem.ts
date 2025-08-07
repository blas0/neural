/**
 * Neural Design System
 * Centralized design tokens and utilities for consistent UI/UX
 * Based on the established stone/zinc color palette and IBM Plex Mono typography
 */

// Color palette with semantic naming
export const colors = {
  // Primary palette
  primary: {
    50: '#fafaf9',   // stone-50 - backgrounds
    100: '#f5f5f4',  // stone-100
    200: '#e7e5e4',  // stone-200 - loading states
    300: '#d6d3d1',  // stone-300
    400: '#a8a29e',  // stone-400 - muted text
    500: '#78716c',  // stone-500 - secondary text
    600: '#57534e',  // stone-600
    700: '#44403c',  // stone-700
    800: '#292524',  // stone-800
    900: '#1c1917',  // stone-900
  },
  
  // Accent palette
  accent: {
    50: '#fafafa',   // zinc-50
    100: '#f4f4f5',  // zinc-100
    200: '#e4e4e7',  // zinc-200
    300: '#d4d4d8',  // zinc-300
    400: '#a1a1aa',  // zinc-400
    500: '#71717a',  // zinc-500
    600: '#52525b',  // zinc-600
    700: '#3f3f46',  // zinc-700
    800: '#27272a',  // zinc-800 - primary buttons, text
    900: '#18181b',  // zinc-900
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',    // green-500
    warning: '#f59e0b',    // amber-500
    error: '#ef4444',      // red-500
    info: '#3b82f6',       // blue-500
  }
} as const;

// Typography system
export const typography = {
  fontFamily: {
    mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    sans: ['system-ui', '-apple-system', 'sans-serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

// Spacing system (Tailwind's default spacing scale)
export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation durations and easings
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom neural easings for brand consistency
    neural: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    neuralIn: 'cubic-bezier(0.4, 0, 0.6, 1)',
    neuralOut: 'cubic-bezier(0, 0, 0.2, 1)',
  }
} as const;

// Component variants for consistent styling
export const componentVariants = {
  button: {
    primary: {
      base: `inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      small: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-all duration-300 ease-out hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      large: `inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
    },
    
    secondary: {
      base: `inline-flex items-center justify-center px-6 py-3 text-base font-medium text-zinc-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all duration-300 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      small: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-all duration-300 ease-out hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      large: `inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all duration-300 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
    },
    
    ghost: {
      base: `inline-flex items-center justify-center px-6 py-3 text-base font-medium text-zinc-800 hover:bg-stone-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      small: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-stone-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
      large: `inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-800 hover:bg-stone-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50`,
    }
  },
  
  card: {
    base: `bg-white rounded-lg shadow-sm border border-stone-200 p-6`,
    elevated: `bg-white rounded-lg shadow-lg border border-stone-200 p-6`,
    flat: `bg-stone-50 rounded-lg border border-stone-200 p-6`,
  },
  
  input: {
    base: `block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors duration-200`,
    error: `block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors duration-200`,
  }
} as const;

// Utility functions for consistent styling
export const utils = {
  // Generate consistent transition classes
  transition: (property = 'all', duration = 'normal', easing = 'neuralOut') => {
    return `transition-${property} duration-${duration} ease-${easing}`;
  },
  
  // Generate consistent focus states
  focusRing: (color = 'zinc-600', offset = 'stone-50') => {
    return `focus:outline-none focus:ring-2 focus:ring-${color} focus:ring-offset-2 focus:ring-offset-${offset}`;
  },
  
  // Generate consistent hover states
  hoverScale: (scale = '105') => {
    return `hover:scale-${scale} transition-transform duration-300 ease-neural`;
  },
  
  // Generate responsive text classes
  responsiveText: (base: string, sm?: string, md?: string, lg?: string) => {
    let classes = `text-${base}`;
    if (sm) classes += ` sm:text-${sm}`;
    if (md) classes += ` md:text-${md}`;
    if (lg) classes += ` lg:text-${lg}`;
    return classes;
  }
};

// Design principles for consistent implementation
export const principles = {
  // Spacing follows 8px grid
  spacing: {
    baseUnit: 8,
    sections: 96,     // 24rem - between major sections
    components: 32,   // 8rem - between components
    elements: 16,     // 4rem - between related elements
    inline: 8,        // 2rem - between inline elements
  },
  
  // Typography scale and usage
  typography: {
    // Use mono font for navigation, buttons, and technical elements
    // Use sans font for body text and descriptions when needed
    hierarchy: {
      h1: '4xl',      // Hero headlines
      h2: '3xl',      // Section headlines
      h3: '2xl',      // Subsection headlines
      h4: 'xl',       // Component headlines
      body: 'base',   // Body text
      small: 'sm',    // Secondary text, captions
      tiny: 'xs',     // Fine print
    }
  },
  
  // Color usage guidelines
  colors: {
    text: {
      primary: 'zinc-800',      // Main text
      secondary: 'stone-500',   // Supporting text
      muted: 'stone-400',       // Disabled/placeholder text
    },
    backgrounds: {
      primary: 'stone-50',      // Main background
      secondary: 'white',       // Card/component backgrounds
      accent: 'stone-100',      // Subtle emphasis
    },
    interactive: {
      primary: 'zinc-800',      // Primary buttons, active states
      secondary: 'zinc-600',    // Secondary buttons, hover states
      muted: 'stone-200',       // Subtle buttons, borders
    }
  }
};

export default {
  colors,
  typography,
  spacing,
  breakpoints,
  animations,
  componentVariants,
  utils,
  principles
};