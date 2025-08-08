import { useState, useEffect } from 'react';

interface ResponsiveDimensions {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useResponsiveDimensions = (
  desktopWidth = 800,
  desktopHeight = 500,
  aspectRatio = desktopWidth / desktopHeight
): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>({
    width: desktopWidth,
    height: desktopHeight,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const calculateDimensions = () => {
      const windowWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const isMobile = windowWidth < 768;
      const isTablet = windowWidth >= 768 && windowWidth < 1024;
      const isDesktop = windowWidth >= 1024;

      let width: number;
      let height: number;

      if (isMobile) {
        // Mobile: Use most of available width with padding, prevent overflow
        width = Math.max(320, Math.min(windowWidth * 0.95, 480));
        height = width / aspectRatio;
      } else if (isTablet) {
        // Tablet: Scale proportionally
        width = Math.max(480, Math.min(windowWidth * 0.85, 700));
        height = width / aspectRatio;
      } else {
        // Desktop: Use provided dimensions or scale down if needed
        width = Math.min(desktopWidth, windowWidth * 0.8);
        height = width / aspectRatio;
      }

      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    // Calculate on mount
    calculateDimensions();

    // Debounce resize events for performance with RAF
    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(calculateDimensions);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [desktopWidth, desktopHeight, aspectRatio]);

  return dimensions;
};