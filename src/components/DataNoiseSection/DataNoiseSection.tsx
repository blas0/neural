import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataNoiseSectionProps, Particle } from './DataNoiseSection.types';
import { generateRandomParticle, updateParticleWavePosition, updateMatrixCycling, PARTICLE_CONFIG } from './DataNoiseSection.utils';

const DataNoiseSection: React.FC<DataNoiseSectionProps> = ({ className = '' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const handleSwimClick = () => {
    // Smooth scroll to Overview of Services section
    const overviewSection = document.getElementById('overview-services');
    if (overviewSection) {
      overviewSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  // Detect mobile vs desktop for particle count
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
  
  const particleCount = isMobile ? PARTICLE_CONFIG.count.mobile : PARTICLE_CONFIG.count.desktop;
  
  // Initialize particles
  useEffect(() => {
    const initialParticles = Array.from({ length: particleCount }, (_, i) => 
      generateRandomParticle(`particle-${i}`)
    );
    setParticles(initialParticles);
  }, [particleCount]);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsAnimating(!mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsAnimating(!e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Animation loop with Matrix cycling and wave motion
  const animateParticles = useCallback(() => {
    if (!isAnimating) return;
    
    const currentTime = Date.now();
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        // First update Matrix cycling effects
        const cycledParticle = updateMatrixCycling(particle, currentTime, isAnimating);
        // Then update wave position
        return updateParticleWavePosition(cycledParticle, 16, currentTime);
      })
    );
  }, [isAnimating]);
  
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, [animateParticles, isAnimating]);
  
  return (
    <section 
      id="data-noise"
      className={`relative w-full min-h-screen bg-stone-50 overflow-hidden flex items-center justify-center py-16 md:py-24 ${className}`}
      aria-label="Data noise background section"
    >
      {/* Wave Motion Particles */}
      <div 
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute font-mono font-medium text-stone-400 select-none transition-opacity duration-300 ${PARTICLE_CONFIG.sizes[particle.size]} ${
              particle.matrixCycling.isGlitching ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: isAnimating ? particle.opacity : 0.1,
              transform: 'translate(-50%, -50%)',
              willChange: isAnimating ? 'transform, opacity' : 'auto',
              textShadow: particle.matrixCycling.isGlitching 
                ? '0 0 3px rgba(0, 0, 0, 0.3), 0 0 6px rgba(0, 0, 0, 0.1)' 
                : 'none'
            }}
          >
            {particle.content}
          </div>
        ))}
      </div>
      
      {/* Central Message */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold italic text-stone-800 leading-tight tracking-tight mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          in a sea of noise, we design in a way that transmits clarity and convert attention into action.
        </h2>
        
        {/* Swim Button */}
        <button 
          onClick={handleSwimClick}
          className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-stone-50"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          swim
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
      
      {/* Accessibility: Reduced motion indicator */}
      {!isAnimating && (
        <div className="sr-only">
          Static background with data fragments for users with reduced motion preference. Wave motion and Matrix character cycling are disabled.
        </div>
      )}
    </section>
  );
};

export default DataNoiseSection;