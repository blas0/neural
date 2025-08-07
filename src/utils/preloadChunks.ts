/**
 * Enhanced preload chunks for better perceived performance
 * Includes connection awareness, data saver respect, and smart scheduling
 */

interface PreloadOptions {
  priority?: 'high' | 'normal' | 'low';
  delay?: number;
  respectDataSaver?: boolean;
}

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  saveData: boolean;
}

/**
 * Determines if preloading should occur based on device and network conditions
 */
const shouldPreload = (respectDataSaver = true): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for data saver mode
  const connection = (navigator as any).connection as NetworkInfo;
  if (respectDataSaver && connection?.saveData) {
    return false;
  }

  // Only preload on good connections and appropriate screen sizes
  const hasGoodConnection = !connection || 
    connection.effectiveType === '4g' || 
    (connection.effectiveType === '3g' && connection.downlink > 1.5);
  
  const isDesktopOrTablet = window.innerWidth > 768;
  const hasEnoughMemory = !('deviceMemory' in navigator) || 
    (navigator as any).deviceMemory >= 4;

  return hasGoodConnection && isDesktopOrTablet && hasEnoughMemory;
};

/**
 * Preloads a specific chunk with intelligent scheduling
 */
export const preloadChunk = (chunkName: string, options: PreloadOptions = {}) => {
  const {
    priority = 'normal',
    delay = 0,
    respectDataSaver = true
  } = options;

  if (!shouldPreload(respectDataSaver)) {
    console.log(`Preload skipped for ${chunkName} due to network/device constraints`);
    return;
  }

  const schedulePreload = (callback: () => void) => {
    const executePreload = () => {
      if ('requestIdleCallback' in window) {
        const timeout = priority === 'high' ? 1000 : priority === 'normal' ? 2000 : 5000;
        (window as any).requestIdleCallback(callback, { timeout });
      } else {
        setTimeout(callback, priority === 'high' ? 0 : 100);
      }
    };

    if (delay > 0) {
      setTimeout(executePreload, delay);
    } else {
      executePreload();
    }
  };

  schedulePreload(() => {
    try {
      switch (chunkName) {
        case 'overview':
          import('../../OverviewOfServices').then(() => 
            console.log('Preloaded: OverviewOfServices')
          );
          break;
        case 'roadmap':
          import('../../RoadmapJourney').then(() => 
            console.log('Preloaded: RoadmapJourney')
          );
          break;
        case 'pricing':
          import('../../PricingStructure').then(() => 
            console.log('Preloaded: PricingStructure')
          );
          break;
        case 'booking':
          import('../components/BookingPopover/BookingPopover').then(() => 
            console.log('Preloaded: BookingPopover')
          );
          break;
        default:
          console.warn(`Unknown chunk: ${chunkName}`);
      }
    } catch (error) {
      console.warn(`Failed to preload chunk ${chunkName}:`, error);
    }
  });
};

/**
 * Preload critical chunks with intelligent prioritization
 */
export const preloadCriticalChunks = () => {
  // High priority: Components likely to be viewed first
  preloadChunk('overview', { priority: 'high' });
  
  // Normal priority: Interactive components
  preloadChunk('booking', { priority: 'normal', delay: 2000 });
  
  // Low priority: Secondary content
  preloadChunk('roadmap', { priority: 'low', delay: 4000 });
  preloadChunk('pricing', { priority: 'low', delay: 6000 });
};

/**
 * Preload chunks based on user interaction hints
 */
export const preloadOnInteraction = () => {
  // Preload pricing when user shows intent (mouse over navigation)
  const navButtons = document.querySelectorAll('[data-section="pricing"], [data-section="roadmap"]');
  
  navButtons.forEach(button => {
    let hoverTimeout: NodeJS.Timeout;
    
    button.addEventListener('mouseenter', () => {
      hoverTimeout = setTimeout(() => {
        const section = button.getAttribute('data-section');
        if (section) {
          preloadChunk(section, { priority: 'high' });
        }
      }, 300); // 300ms hover delay to avoid accidental preloads
    });
    
    button.addEventListener('mouseleave', () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    });
  });
};