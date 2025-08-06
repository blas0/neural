export interface Particle {
  id: string;
  content: string;
  x: number;
  y: number;
  size: 'small' | 'medium';
  speed: number;
  direction: {
    x: number;
    y: number;
  };
  opacity: number;
  fadeDirection: 'in' | 'out';
  // Wave motion properties
  wave: {
    baseY: number;        // Base vertical position for wave
    phase: number;        // Wave phase offset for staggered timing
    amplitude: number;    // Wave height variation
    frequency: number;    // Wave frequency multiplier
    horizontalSpeed: number; // Speed of left-to-right movement
  };
  // Matrix cycling properties
  matrixCycling: {
    originalContent: string;
    currentContent: string;
    cyclingSpeed: number;
    lastCycleTime: number;
    isGlitching: boolean;
    glitchDuration: number;
    glitchStartTime: number;
  };
}

export interface DataNoiseSectionProps {
  className?: string;
}

export interface ParticleConfig {
  count: {
    mobile: number;
    desktop: number;
  };
  speed: {
    min: number;
    max: number;
  };
  sizes: {
    small: string;
    medium: string;
  };
  opacity: {
    min: number;
    max: number;
  };
}