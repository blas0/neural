import { Particle, ParticleConfig } from './DataNoiseSection.types';

// Data-like content for particles
export const DATA_FRAGMENTS = [
  '01101', '11010', '00110', '10101',
  'HTTP/', 'HTTPS', 'API/', 'REST',
  'JSON', 'XML', 'CSV', 'SQL',
  '#fff', '#000', 'rgba', 'hsla',
  '404', '200', '500', '301',
  'null', 'void', 'NaN', 'undefined',
  '$var', '{id}', '[0]', '++i',
  'GET', 'POST', 'PUT', 'DELETE',
  'px', 'rem', '%', 'vh',
  'async', 'await', 'try', 'catch',
  '&&', '||', '===', '!==',
  'div', 'span', 'img', 'svg',
  '.js', '.ts', '.css', '.html',
  'npm', 'yarn', 'git', 'ssh',
  '127.0', '192.', 'localhost', ':3000'
];

// Character pool for Matrix cycling
export const MATRIX_CHARACTERS = {
  numbers: '0123456789',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  symbols: '!@#$%^&*()[]{}|;:,.<>?/\\-_+=~`\'"',
  binary: '01',
  hex: '0123456789ABCDEF'
};

// Combined character pool for random selection
export const ALL_MATRIX_CHARS = 
  MATRIX_CHARACTERS.numbers + 
  MATRIX_CHARACTERS.letters + 
  MATRIX_CHARACTERS.symbols;

export const PARTICLE_CONFIG: ParticleConfig = {
  count: {
    mobile: 20,  // Increased for better wave effect
    desktop: 35
  },
  speed: {
    min: 0.3,
    max: 1.2
  },
  sizes: {
    small: 'text-xs',
    medium: 'text-sm'
  },
  opacity: {
    min: 0.1,
    max: 0.3
  }
};

// Wave motion configuration
export const WAVE_CONFIG = {
  horizontalSpeed: {
    min: 0.8,  // Slower particles for organic feel
    max: 1.5   // Faster particles for variation
  },
  amplitude: {
    min: 8,    // Minimum wave height
    max: 15    // Maximum wave height
  },
  frequency: {
    min: 0.8,  // Wave frequency multiplier
    max: 1.2
  },
  crossDuration: {
    min: 8000,  // 8 seconds to cross screen
    max: 12000  // 12 seconds to cross screen
  },
  fadeDistance: 200 // pixels over which particles fade out from right edge
};

// Generate random character from matrix pool
export const getRandomMatrixChar = (): string => {
  return ALL_MATRIX_CHARS[Math.floor(Math.random() * ALL_MATRIX_CHARS.length)];
};

// Morph a string by changing random characters
export const morphString = (original: string, morphIntensity: number = 0.3): string => {
  return original
    .split('')
    .map(char => {
      // Preserve spaces and some structure
      if (char === ' ' || char === '/' || char === '.' || char === ':') {
        return char;
      }
      // Random chance to morph character
      return Math.random() < morphIntensity ? getRandomMatrixChar() : char;
    })
    .join('');
};

// Generate glitch version of string (higher morph intensity)
export const glitchString = (original: string): string => {
  return morphString(original, 0.7);
};

export const generateRandomParticle = (id: string): Particle => {
  const content = DATA_FRAGMENTS[Math.floor(Math.random() * DATA_FRAGMENTS.length)];
  const size = Math.random() > 0.6 ? 'medium' : 'small';
  const speed = PARTICLE_CONFIG.speed.min + Math.random() * (PARTICLE_CONFIG.speed.max - PARTICLE_CONFIG.speed.min);
  
  // Start particles off-screen left with staggered timing
  const x = -10 - Math.random() * 20; // Start between -10% and -30%
  const baseY = Math.random() * 100;   // Random vertical starting position
  const y = baseY; // Initial y matches baseY
  
  // Direction is primarily rightward for wave motion
  const direction = {
    x: 1, // Always moving right
    y: 0  // Vertical movement handled by wave function
  };
  
  const opacity = PARTICLE_CONFIG.opacity.min + Math.random() * (PARTICLE_CONFIG.opacity.max - PARTICLE_CONFIG.opacity.min);
  
  // Wave properties for fluid motion
  const wave = {
    baseY,
    phase: Math.random() * Math.PI * 2, // Random phase for staggered waves
    amplitude: WAVE_CONFIG.amplitude.min + Math.random() * (WAVE_CONFIG.amplitude.max - WAVE_CONFIG.amplitude.min),
    frequency: WAVE_CONFIG.frequency.min + Math.random() * (WAVE_CONFIG.frequency.max - WAVE_CONFIG.frequency.min),
    horizontalSpeed: WAVE_CONFIG.horizontalSpeed.min + Math.random() * (WAVE_CONFIG.horizontalSpeed.max - WAVE_CONFIG.horizontalSpeed.min)
  };
  
  // Matrix cycling properties
  const cyclingSpeed = 100 + Math.random() * 200; // 100-300ms between cycles
  const now = Date.now();
  
  return {
    id,
    content,
    x,
    y,
    size,
    speed,
    direction,
    opacity,
    fadeDirection: Math.random() > 0.5 ? 'in' : 'out',
    wave,
    matrixCycling: {
      originalContent: content,
      currentContent: content,
      cyclingSpeed,
      lastCycleTime: now,
      isGlitching: false,
      glitchDuration: 200 + Math.random() * 300, // 200-500ms glitch duration
      glitchStartTime: 0
    }
  };
};

// Update particle with Matrix cycling effects
export const updateMatrixCycling = (particle: Particle, currentTime: number, isAnimating: boolean): Particle => {
  if (!isAnimating) {
    return particle;
  }

  const { matrixCycling } = particle;
  let updatedCycling = { ...matrixCycling };

  // Handle glitch effect
  if (matrixCycling.isGlitching) {
    const glitchElapsed = currentTime - matrixCycling.glitchStartTime;
    
    if (glitchElapsed >= matrixCycling.glitchDuration) {
      // End glitch, return to original
      updatedCycling.isGlitching = false;
      updatedCycling.currentContent = matrixCycling.originalContent;
    } else {
      // Continue glitching - generate new glitch every 50ms during glitch
      if (glitchElapsed % 50 < 16) { // Roughly every 50ms in our 16ms cycle
        updatedCycling.currentContent = glitchString(matrixCycling.originalContent);
      }
    }
  } else {
    // Normal cycling behavior
    const timeSinceLastCycle = currentTime - matrixCycling.lastCycleTime;
    
    if (timeSinceLastCycle >= matrixCycling.cyclingSpeed) {
      // Random chance to start glitch (5% chance)
      if (Math.random() < 0.05) {
        updatedCycling.isGlitching = true;
        updatedCycling.glitchStartTime = currentTime;
        updatedCycling.currentContent = glitchString(matrixCycling.originalContent);
      } else {
        // Normal morph
        updatedCycling.currentContent = morphString(matrixCycling.originalContent);
      }
      
      updatedCycling.lastCycleTime = currentTime;
    }
  }

  return {
    ...particle,
    content: updatedCycling.currentContent,
    matrixCycling: updatedCycling
  };
};

export const updateParticleWavePosition = (particle: Particle, deltaTime: number, currentTime: number): Particle => {
  let { x, y, opacity, fadeDirection, wave } = particle;
  const { speed } = particle;
  
  // Update horizontal position (left to right movement)
  x += wave.horizontalSpeed * speed * deltaTime * 0.1;
  
  // Calculate wave-based vertical position
  // Using time-based sine wave for smooth, continuous motion
  const timeOffset = currentTime * 0.001; // Convert to seconds
  const waveValue = Math.sin((x * 0.05 * wave.frequency) + wave.phase + timeOffset) * wave.amplitude;
  y = wave.baseY + waveValue;
  
  // Calculate fade effect based on position (fade out from right edge)
  const fadeStartX = 100 - (WAVE_CONFIG.fadeDistance / window.innerWidth * 100); // Convert pixels to percentage
  if (x > fadeStartX) {
    // Fade from 1 to 0 as particle approaches right edge
    const fadeProgress = (x - fadeStartX) / (110 - fadeStartX);
    opacity = Math.max(0, 1 - fadeProgress);
  } else {
    // Particles are solid until they enter fade zone
    opacity = 1;
  }
  
  // Recycle particles that have moved off-screen right
  if (x > 110) {
    // Reset to left side with new random properties
    x = -10 - Math.random() * 20;
    wave.baseY = Math.random() * 100;
    wave.phase = Math.random() * Math.PI * 2;
    wave.amplitude = WAVE_CONFIG.amplitude.min + Math.random() * (WAVE_CONFIG.amplitude.max - WAVE_CONFIG.amplitude.min);
    wave.frequency = WAVE_CONFIG.frequency.min + Math.random() * (WAVE_CONFIG.frequency.max - WAVE_CONFIG.frequency.min);
    wave.horizontalSpeed = WAVE_CONFIG.horizontalSpeed.min + Math.random() * (WAVE_CONFIG.horizontalSpeed.max - WAVE_CONFIG.horizontalSpeed.min);
  }
  
  // Ensure particles stay within vertical bounds
  if (y < 0) y = 0;
  if (y > 100) y = 100;
  
  // Update opacity for fade in/out effect
  const fadeSpeed = 0.002 * deltaTime;
  if (fadeDirection === 'in') {
    opacity += fadeSpeed;
    if (opacity >= PARTICLE_CONFIG.opacity.max) {
      fadeDirection = 'out';
    }
  } else {
    opacity -= fadeSpeed;
    if (opacity <= PARTICLE_CONFIG.opacity.min) {
      fadeDirection = 'in';
    }
  }
  
  return {
    ...particle,
    x,
    y,
    opacity,
    fadeDirection,
    wave
  };
};