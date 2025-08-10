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
      // CRITICAL: Align with Tailwind CSS breakpoints to prevent mobile menu timing conflicts
      // Tailwind: sm: 640px, md: 768px, lg: 1024px
      const isMobile = windowWidth < 640; // Was 768, now matches Tailwind sm
      const isTablet = windowWidth >= 640 && windowWidth < 1024; // Was 768-1024, now 640-1024
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
    let timeoutId: ReturnType<typeof setTimeout>;
    let rafId: number;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      
      // Reduced debounce time for more responsive mobile menu behavior
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(calculateDimensions);
      }, 100); // Was 150ms, now 100ms for faster responsiveness
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