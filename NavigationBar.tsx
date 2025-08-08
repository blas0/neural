import React, { useState, useEffect } from 'react';
import { NavigationBarProps, MobileMenuProps } from './NavigationBar.types';
import { useResponsiveDimensions } from './src/hooks/useResponsiveDimensions';

// Mobile Menu Component
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onPricingClick,
  onAboutClick,
  onCTAClick,
  onRoadmapClick
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus trapping and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        // Get all focusable elements within the mobile menu
        const focusableElements = document.querySelectorAll(
          '[data-mobile-menu="true"] button, [data-mobile-menu="true"] [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the first element when menu opens
    setTimeout(() => {
      const firstFocusable = document.querySelector(
        '[data-mobile-menu="true"] button'
      ) as HTMLElement;
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePricingClick = () => {
    onPricingClick?.();
    onClose();
  };

  const handleAboutClick = () => {
    onAboutClick?.();
    onClose();
  };

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onCTAClick?.(event);
    onClose();
  };

  const handleRoadmapClick = () => {
    onRoadmapClick?.();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ease-out z-[9999] ${
        isOpen
          ? 'opacity-100 visible pointer-events-auto'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      data-mobile-menu="true"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 transition-all duration-300 ease-out ${
          isOpen ? 'backdrop-blur-sm' : 'backdrop-blur-none'
        }`}
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div
        className={`mobile-menu-panel absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-stone-50 shadow-2xl transition-transform duration-300 ease-out pt-safe-top pb-safe-bottom overflow-hidden z-[10000] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Scrollable content container */}
        <div className="h-full overflow-y-auto scrollbar-hide mobile-scroll-optimized">
        {/* Close Button */}
        <div className="flex justify-end p-4 sm:p-6 relative z-[10001]">
          <button
            onClick={onClose}
            className="p-3 min-h-touch min-w-touch text-zinc-800 hover:text-zinc-600 active:text-zinc-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg touch-manipulation relative z-[10001] bg-stone-50"
            aria-label="Close navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 sm:px-6 space-y-2 font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          <button
            onClick={handlePricingClick}
            className="block w-full text-left text-xl sm:text-2xl font-medium text-zinc-800 hover:text-zinc-600 active:text-zinc-900 transition-colors duration-200 py-4 px-2 min-h-touch focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg touch-manipulation"
          >
            pricing
          </button>
          
          <button
            onClick={handleAboutClick}
            className="block w-full text-left text-xl sm:text-2xl font-medium text-zinc-800 hover:text-zinc-600 active:text-zinc-900 transition-colors duration-200 py-4 px-2 min-h-touch focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg touch-manipulation"
          >
            about
          </button>
          
          <button
            onClick={handleRoadmapClick}
            className="block w-full text-left text-xl sm:text-2xl font-medium text-zinc-800 hover:text-zinc-600 active:text-zinc-900 transition-colors duration-200 py-4 px-2 min-h-touch focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg touch-manipulation"
          >
            roadmap
          </button>

          {/* Mobile CTA */}
          <div className="pt-6">
            <button
              onClick={handleCTAClick}
              className="group w-full inline-flex items-center justify-center px-6 sm:px-8 py-4 min-h-touch text-base sm:text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 touch-manipulation"
            >
              book a call
              <svg 
                className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </button>
          </div>
        </nav>
        </div>
      </div>
    </div>
  );
};

// Main Navigation Component
const NavigationBar: React.FC<NavigationBarProps> = ({
  className = '',
  onLogoClick,
  onPricingClick,
  onAboutClick,
  onCTAClick,
  onRoadmapClick,
  logoText = 'neurix',
  ctaText = 'book a call',
  isFixed = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  
  // Use responsive dimensions for better mobile detection
  const { isMobile, isTablet, isDesktop } = useResponsiveDimensions();

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop, isMobileMenuOpen]);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 20);
          
          // Calculate opacity based on scroll position (0.9 to 1.0 range for better visibility)
          const maxScroll = 300; // Maximum scroll distance for opacity transition
          const minOpacity = 0.9; // Increased to 0.9 for optimal visibility
          const maxOpacity = 1.0;
          const opacity = Math.max(
            minOpacity, 
            maxOpacity - (scrollTop / maxScroll) * (maxOpacity - minOpacity)
          );
          setScrollOpacity(opacity);
          ticking = false;
        });
        ticking = true;
      }
    };

    if (isFixed) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isFixed]);

  const handleLogoClick = () => {
    onLogoClick?.();
  };

  const handlePricingClick = () => {
    onPricingClick?.();
  };

  const handleAboutClick = () => {
    onAboutClick?.();
  };

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onCTAClick?.(event);
  };

  const handleRoadmapClick = () => {
    onRoadmapClick?.();
  };

  const toggleMobileMenu = () => {
    console.log('Mobile menu toggle clicked', { 
      isMobileMenuOpen, 
      isMobile, 
      isTablet, 
      isDesktop,
      windowWidth: window.innerWidth 
    });
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Determine if we should show mobile elements
  const showMobileElements = isMobile || isTablet;
  const showDesktopElements = isDesktop;

  return (
    <>
      <nav
        className={`navbar-mobile-optimized w-full transition-all duration-300 ease-out ${
          isFixed ? 'fixed top-0 left-0 right-0' : 'relative'
        } ${
          isScrolled && isFixed
            ? 'bg-stone-50 backdrop-blur-sm shadow-sm'
            : 'bg-stone-50'
        } ${className}`}
        style={{ 
          opacity: scrollOpacity,
          position: isFixed ? 'fixed' : 'relative',
          top: isFixed ? 0 : 'auto',
          left: isFixed ? 0 : 'auto',
          right: isFixed ? 0 : 'auto',
          zIndex: 1000,
          willChange: isFixed ? 'opacity, backdrop-filter' : 'auto',
          transform: isFixed ? 'translateZ(0)' : 'none'
        }}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 blur-none translate-y-0' 
            : 'opacity-0 blur-sm translate-y-8'
        }`}>
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={handleLogoClick}
                className="text-2xl sm:text-3xl font-bold text-zinc-800 hover:text-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg px-2 py-1"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                aria-label="neurix homepage"
              >
                {logoText}
              </button>
            </div>

            {/* Desktop Navigation - Only show on desktop screens */}
            {showDesktopElements && (
              <div className="hidden lg:flex items-center space-x-8">
                <button
                  onClick={handlePricingClick}
                  data-section="pricing"
                  className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  aria-label="Navigate to pricing section"
                >
                  pricing
                </button>
                
                <button
                  onClick={handleAboutClick}
                  data-section="about"
                  className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  aria-label="Navigate to about section"
                >
                  about
                </button>
                
                <button
                  onClick={handleRoadmapClick}
                  data-section="roadmap"
                  className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  aria-label="Navigate to roadmap section"
                >
                  roadmap
                </button>

                {/* CTA Button */}
                <button
                  onClick={handleCTAClick}
                  className="group inline-flex items-center px-6 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {ctaText}
                  <svg 
                    className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Mobile Menu Button - Show on mobile and tablet */}
            {showMobileElements && (
              <div className="block lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-center p-3 min-h-[44px] min-w-[44px] text-zinc-800 hover:text-zinc-600 active:text-zinc-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg touch-manipulation bg-transparent border-none"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Only render on mobile/tablet */}
      {showMobileElements && (
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onPricingClick={onPricingClick}
          onAboutClick={onAboutClick}
          onRoadmapClick={onRoadmapClick}
          onCTAClick={onCTAClick}
        />
      )}

      {/* Spacer for fixed navigation */}
      {isFixed && <div className="h-16 sm:h-20" />}
    </>
  );
};

export default NavigationBar;