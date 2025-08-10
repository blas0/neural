import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimationState, AnimationConfig } from '../components/BookingPopover/BookingPopover.types';

// Animation configuration constants
const ANIMATION_CONFIG: AnimationConfig = {
  duration: {
    enter: 300,
    exit: 250,
  },
  easing: {
    enter: 'ease-out',
    exit: 'ease-in',
  },
};

interface UseBookingPopoverReturn {
  isOpen: boolean;
  animationState: AnimationState;
  triggerElement: HTMLElement | null;
  defaultTier?: 'tier-1' | 'tier-2' | 'tier-3';
  openPopover: (element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => void;
  closePopover: () => void;
}

export const useBookingPopover = (): UseBookingPopoverReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('closed');
  const [defaultTier, setDefaultTier] = useState<'tier-1' | 'tier-2' | 'tier-3' | undefined>();
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const openPopover = useCallback((element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    triggerElementRef.current = element;
    setDefaultTier(tier);
    setIsOpen(true);
    setAnimationState('opening');
    
    // Use requestAnimationFrame for smoother timing, then set timeout for animation duration
    requestAnimationFrame(() => {
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationState('open');
      }, ANIMATION_CONFIG.duration.enter);
    });
  }, []);

  const closePopover = useCallback(() => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setAnimationState('closing');
    
    // Close after exit animation completes
    animationTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setAnimationState('closed');
      setDefaultTier(undefined);
      triggerElementRef.current = null;
    }, ANIMATION_CONFIG.duration.exit);
  }, []);

  return {
    isOpen,
    animationState,
    triggerElement: triggerElementRef.current,
    defaultTier,
    openPopover,
    closePopover,
  };
};