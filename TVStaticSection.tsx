import React, { useEffect, useState } from 'react';
import { TVStaticSectionProps } from './TVStaticSection.types';

const TVStaticSection: React.FC<TVStaticSectionProps> = ({
  className = '',
  customText = "In a sea of noise, we design brands that transmit clarity and convert attention into action.",
  staticIntensity = 0.8,
  heightVariant = 'medium',
  animationDelay = 1200,
  respectReducedMotion = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    if (respectReducedMotion) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldAnimate(!prefersReducedMotion);
    }

    // Trigger fade-in animation with delay for sequential effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay, respectReducedMotion]);

  // Height classes based on variant
  const heightClasses = {
    small: 'h-64 sm:h-80',
    medium: 'h-80 sm:h-96 md:h-[32rem]',
    large: 'h-96 sm:h-[32rem] md:h-[40rem]',
    viewport: 'h-screen'
  };

  // Note: Using SVG-based noise instead of canvas for better performance

  return (
    <section 
      className={`relative overflow-hidden ${heightClasses[heightVariant]} flex items-center justify-center ${className}`}
    >
      {/* TV Static Background */}
      <div className="absolute inset-0 bg-black">
        {/* Static noise layers for depth */}
        {shouldAnimate && (
          <>
            {/* Primary static layer */}
            <div 
              className="absolute inset-0 opacity-90 animate-tv-static-1"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.8'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
              }}
            />
            
            {/* Secondary static layer for more chaos */}
            <div 
              className="absolute inset-0 opacity-60 animate-tv-static-2"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)' opacity='0.6'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
              }}
            />
            
            {/* Tertiary static layer for fine grain */}
            <div 
              className="absolute inset-0 opacity-40 animate-tv-static-3"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' seed='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)' opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
              }}
            />
          </>
        )}
        
        {/* Fallback static pattern for reduced motion */}
        {!shouldAnimate && (
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='staticNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23staticNoise)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
        )}
        
        {/* Vignette overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 blur-none translate-y-0' 
            : 'opacity-0 blur-sm translate-y-8'
        }`}>
          <h2 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold italic text-white leading-tight tracking-tight tv-static-text ${shouldAnimate ? 'tv-static-glow' : ''}`}
            style={{ 
              fontFamily: 'Cormorant Garamond, serif'
            }}
          >
            {customText}
          </h2>
        </div>
      </div>
      
      {/* Optional scan lines for authentic CRT effect */}
      {shouldAnimate && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.05) 2px,
              rgba(255, 255, 255, 0.05) 4px
            )`
          }}
        />
      )}
    </section>
  );
};

export default TVStaticSection;