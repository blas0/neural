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
    <section className={`min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-stone-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 blur-none translate-y-0' 
            : 'opacity-0 blur-sm translate-y-8'
        }`}>
          {/* Main Header */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold italic text-zinc-800 mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {customHeader}
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-zinc-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
          >
            {customSubtitle}
          </p>
          
          {/* CTA Button */}
          <button 
            onClick={handleCTAClick}
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {customCTAText}
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
    </section>
  );
};

export default HeroSection;