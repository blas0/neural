import { NAVBAR_HEIGHT, SECTION_IDS, NAVIGATION_CONFIG } from './constants';

/**
 * Robust scroll utility that handles lazy loading timing issues and provides
 * consistent navigation behavior across the application.
 */

interface ScrollOptions {
  /** Maximum number of attempts to find the target element */
  maxAttempts?: number;
  /** Delay between scroll attempts in milliseconds */
  attemptDelay?: number;
  /** Additional offset from the navbar height */
  additionalOffset?: number;
  /** Custom scroll behavior */
  behavior?: ScrollBehavior;
}

/**
 * Calculates the appropriate navbar height offset based on screen size
 */
const getNavbarOffset = (): number => {
  if (typeof window === 'undefined') return NAVBAR_HEIGHT.DESKTOP_PX;
  return window.innerWidth >= 640 ? NAVBAR_HEIGHT.DESKTOP_PX : NAVBAR_HEIGHT.MOBILE_PX;
};

/**
 * Attempts to scroll to an element with retry logic for lazy-loaded content
 * Now includes visual feedback and improved accessibility
 */
const scrollToElementWithRetry = async (
  elementId: string, 
  attempt: number = 1,
  options: ScrollOptions = {}
): Promise<boolean> => {
  const {
    maxAttempts = NAVIGATION_CONFIG.MAX_SCROLL_ATTEMPTS,
    attemptDelay = NAVIGATION_CONFIG.SCROLL_ATTEMPT_DELAY,
    additionalOffset = 0,
    behavior = NAVIGATION_CONFIG.SCROLL_BEHAVIOR
  } = options;

  const element = document.getElementById(elementId);
  
  if (element) {
    try {
      const navbarHeight = getNavbarOffset();
      const offsetTop = element.offsetTop - navbarHeight - additionalOffset;
      const scrollTop = Math.max(0, offsetTop);
      
      // Add subtle visual feedback before scrolling
      const currentlyFocused = document.activeElement;
      
      window.scrollTo({
        top: scrollTop,
        behavior
      });
      
      // Wait for scroll to complete, then enhance focus management
      if (behavior === 'smooth') {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Improve accessibility by managing focus appropriately
      const focusableElement = element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElement && focusableElement !== currentlyFocused) {
        // Only move focus if it would be helpful (not already focused somewhere in the section)
        const currentSection = currentlyFocused?.closest('section');
        if (currentSection?.id !== elementId) {
          (focusableElement as HTMLElement).focus({ preventScroll: true });
        }
      }
      
      console.log(`Successfully scrolled to section: ${elementId}`);
      return true;
    } catch (error) {
      console.error(`Error scrolling to element ${elementId}:`, error);
      return false;
    }
  }

  // Element not found - retry if attempts remaining
  if (attempt < maxAttempts) {
    console.warn(`Element "${elementId}" not found, retrying... (attempt ${attempt}/${maxAttempts})`);
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await scrollToElementWithRetry(elementId, attempt + 1, options);
        resolve(result);
      }, attemptDelay);
    });
  }

  console.error(`Element with id "${elementId}" not found after ${maxAttempts} attempts`);
  return false;
};

/**
 * Main scroll function that should be used throughout the application
 */
export const scrollToSection = async (
  sectionId: string, 
  options: ScrollOptions = {}
): Promise<boolean> => {
  // Validate that the section ID exists in our constants
  const validSectionIds = Object.values(SECTION_IDS);
  if (!validSectionIds.includes(sectionId as any)) {
    console.warn(`Section ID "${sectionId}" not found in SECTION_IDS constants. Available sections:`, validSectionIds);
  }

  // Add a small delay for lazy-loaded components to render
  await new Promise(resolve => setTimeout(resolve, NAVIGATION_CONFIG.LAZY_LOAD_DELAY));
  
  return scrollToElementWithRetry(sectionId, 1, options);
};

/**
 * Convenience functions for specific sections
 */
export const scrollToTop = (options?: ScrollOptions) => 
  scrollToSection(SECTION_IDS.TOP, options);

export const scrollToAbout = (options?: ScrollOptions) => 
  scrollToSection(SECTION_IDS.ABOUT, options);

export const scrollToRoadmap = (options?: ScrollOptions) => 
  scrollToSection(SECTION_IDS.ROADMAP, options);

export const scrollToPricing = (options?: ScrollOptions) => 
  scrollToSection(SECTION_IDS.PRICING, options);

/**
 * Hook for components that need to trigger navigation
 * Returns navigation functions with consistent behavior
 */
export const useNavigation = () => {
  return {
    scrollToSection,
    scrollToTop,
    scrollToAbout,
    scrollToRoadmap,
    scrollToPricing,
    sectionIds: SECTION_IDS,
  };
};

/**
 * Utility to check if a section element exists in the DOM
 */
export const checkSectionExists = (sectionId: string): boolean => {
  return !!document.getElementById(sectionId);
};

/**
 * Utility to get all missing sections from the DOM
 */
export const getMissingSections = (): string[] => {
  return Object.values(SECTION_IDS).filter(id => !checkSectionExists(id));
};