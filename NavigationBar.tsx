import React, { useState, useEffect } from 'react';
import { NavigationBarProps, MobileMenuProps } from './NavigationBar.types';

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
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-out ${
        isOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div
        className={`absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-stone-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2 text-zinc-800 hover:text-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
            aria-label="Close navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-6 space-y-8" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          <button
            onClick={handlePricingClick}
            className="block w-full text-left text-2xl font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
          >
            pricing
          </button>
          
          <button
            onClick={handleAboutClick}
            className="block w-full text-left text-2xl font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
          >
            about
          </button>
          
          <button
            onClick={handleRoadmapClick}
            className="block w-full text-left text-2xl font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
          >
            roadmap
          </button>

          {/* Mobile CTA */}
          <div className="pt-8">
            <button
              onClick={handleCTAClick}
              className="group w-full inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50"
            >
              book a call
              <svg 
                className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
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
  ctaText = 'Book a Call',
  isFixed = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
      
      // Calculate opacity based on scroll position (0.85 to 1.0 range for better visibility)
      const maxScroll = 300; // Maximum scroll distance for opacity transition
      const minOpacity = 0.85; // Increased to 0.85 for optimal visibility
      const maxOpacity = 1.0;
      const opacity = Math.max(
        minOpacity, 
        maxOpacity - (scrollTop / maxScroll) * (maxOpacity - minOpacity)
      );
      setScrollOpacity(opacity);
    };

    if (isFixed) {
      window.addEventListener('scroll', handleScroll);
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
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`w-full transition-all duration-300 ease-out z-50 ${
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
          right: isFixed ? 0 : 'auto'
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={handlePricingClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                pricing
              </button>
              
              <button
                onClick={handleAboutClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                about
              </button>
              
              <button
                onClick={handleRoadmapClick}
                className="text-lg font-medium text-zinc-800 hover:text-zinc-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
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

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-zinc-800 hover:text-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 rounded-lg"
                aria-label="Toggle navigation menu"
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onPricingClick={onPricingClick}
        onAboutClick={onAboutClick}
        onRoadmapClick={onRoadmapClick}
        onCTAClick={onCTAClick}
      />

      {/* Spacer for fixed navigation */}
      {isFixed && <div className="h-16 sm:h-20" />}
    </>
  );
};

export default NavigationBar;