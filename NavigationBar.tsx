import React, { useState, useEffect } from 'react';
import { NavigationBarProps } from './NavigationBar.types';

// Mobile Menu Modal Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onPricingClick?: () => void;
  onAboutClick?: () => void;
  onRoadmapClick?: () => void;
  onCTAClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onPricingClick,
  onAboutClick,
  onCTAClick,
  onRoadmapClick
}) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle keyboard navigation and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          '[data-mobile-menu] button'
        ) as NodeListOf<HTMLElement>;
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus first button when menu opens
    const timer = setTimeout(() => {
      const firstButton = document.querySelector('[data-mobile-menu] button') as HTMLElement;
      firstButton?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleNavClick = (callback?: () => void) => {
    callback?.();
    onClose();
  };

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onCTAClick?.(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      data-mobile-menu
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Slide-out Menu Panel */}
      <div className="ml-auto">
        <div className="h-full w-80 max-w-[85vw] bg-stone-50 shadow-2xl relative overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center p-6 border-b border-stone-200">
            <span 
              className="text-lg font-semibold text-zinc-800"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              menu
            </span>
            <button
              onClick={onClose}
              className="p-2 text-zinc-600 hover:text-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6">
            <div className="space-y-4">
              <button
                onClick={() => handleNavClick(onPricingClick)}
                className="block w-full text-left text-lg font-medium text-zinc-800 hover:text-zinc-600 py-3 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                pricing
              </button>
              
              <button
                onClick={() => handleNavClick(onAboutClick)}
                className="block w-full text-left text-lg font-medium text-zinc-800 hover:text-zinc-600 py-3 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                about
              </button>
              
              <button
                onClick={() => handleNavClick(onRoadmapClick)}
                className="block w-full text-left text-lg font-medium text-zinc-800 hover:text-zinc-600 py-3 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                roadmap
              </button>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <button
                onClick={handleCTAClick}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                book a call
                <svg 
                  className="ml-2 w-4 h-4" 
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

// Main Navigation Bar Component
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
  
  // Detect screen size using media queries
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Handle scroll effects
  useEffect(() => {
    if (!isFixed) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`w-full z-[1050] ${
          isFixed ? 'fixed top-0 left-0 right-0' : 'relative'
        } ${
          isScrolled && isFixed
            ? 'bg-stone-50/95 backdrop-blur-sm shadow-sm'
            : 'bg-stone-50'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={onLogoClick}
              className="text-2xl lg:text-3xl font-bold text-zinc-800 hover:text-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 rounded-lg px-2 py-1"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              aria-label={`${logoText} homepage`}
            >
              {logoText}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={onPricingClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                pricing
              </button>
              
              <button
                onClick={onAboutClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                about
              </button>
              
              <button
                onClick={onRoadmapClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                roadmap
              </button>

              <button
                onClick={onCTAClick}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {ctaText}
                <svg 
                  className="ml-2 w-4 h-4" 
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-zinc-800 hover:text-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onPricingClick={onPricingClick}
        onAboutClick={onAboutClick}
        onRoadmapClick={onRoadmapClick}
        onCTAClick={onCTAClick}
      />

      {/* Spacer for fixed navigation */}
      {isFixed && <div className="h-16 lg:h-20" />}
    </>
  );
};

export default NavigationBar;