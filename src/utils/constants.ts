// Navigation height constants
export const NAVBAR_HEIGHT = {
  MOBILE: '4rem', // 64px
  DESKTOP: '5rem', // 80px
  MOBILE_PX: 64,
  DESKTOP_PX: 80,
} as const;

// CSS custom properties for use in Tailwind classes
export const NAVBAR_HEIGHT_CSS = {
  MOBILE_CALC: 'calc(100vh - 4rem)',
  DESKTOP_CALC: 'calc(100vh - 5rem)',
} as const;

// Navigation section IDs - centralized source of truth
export const SECTION_IDS = {
  TOP: 'top',
  DATA_NOISE: 'data-noise', 
  ABOUT: 'about', // OverviewOfServices section
  ROADMAP: 'roadmap',
  PRICING: 'pricing',
} as const;

// Navigation configuration for consistent behavior
export const NAVIGATION_CONFIG = {
  // Scroll behavior settings
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  SCROLL_BLOCK: 'start' as ScrollLogicalPosition,
  
  // Lazy loading considerations
  LAZY_LOAD_DELAY: 100, // ms to wait for lazy components
  MAX_SCROLL_ATTEMPTS: 3,
  SCROLL_ATTEMPT_DELAY: 200, // ms between attempts
  
  // Intersection observer settings for lazy sections
  LAZY_ROOT_MARGIN: '200px', // Load sections 200px before viewport
} as const;