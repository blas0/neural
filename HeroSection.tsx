import React, { useEffect, useState } from 'react';
import { HeroSectionProps } from './HeroSection.types';

const HeroSection: React.FC<HeroSectionProps> = ({ 
  className = '',
  onCTAClick,
  customHeader = "we design websites to capture your leads",
  customSubtitle = "for teams and businesses seeking a better performing & lead generating website.",
  customCTAText = "see it work"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after navbar (delay for sequential effect)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600); // 600ms delay to wait for navbar animation
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Smooth scroll to DataNoise section
    const dataNoiseSection = document.getElementById('data-noise');
    if (dataNoiseSection) {
      dataNoiseSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return (
    <section className={`min-h-[100dvh] min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-stone-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-safe-top pb-safe-bottom ${className}`}>
        <div className={`w-full max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 blur-none translate-y-0' 
            : 'opacity-0 blur-sm translate-y-8'
        }`}>
          {/* Main Header */}
          <h1 
            className="text-fluid-4xl sm:text-fluid-5xl md:text-fluid-6xl lg:text-fluid-7xl font-bold italic text-zinc-800 mb-4 sm:mb-6 leading-tight tracking-tight font-cormorant px-2"
          >
            {customHeader}
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-fluid-lg sm:text-fluid-xl md:text-fluid-2xl text-zinc-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-cormorant font-medium px-2"
          >
            {customSubtitle}
          </p>
          
          {/* CTA Button - Mobile optimized */}
          <button 
            onClick={handleCTAClick}
            className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 min-h-touch text-base sm:text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50 touch-manipulation font-cormorant"
          >
            {customCTAText}
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
    </section>
  );
};

export default HeroSection;