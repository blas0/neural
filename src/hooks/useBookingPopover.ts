import { useState, useRef, useCallback } from 'react';

interface UseBookingPopoverReturn {
  isOpen: boolean;
  triggerElement: HTMLElement | null;
  defaultTier?: 'tier-1' | 'tier-2' | 'tier-3';
  openPopover: (element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => void;
  closePopover: () => void;
}

export const useBookingPopover = (): UseBookingPopoverReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTier, setDefaultTier] = useState<'tier-1' | 'tier-2' | 'tier-3' | undefined>();
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const openPopover = useCallback((element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => {
    triggerElementRef.current = element;
    setDefaultTier(tier);
    setIsOpen(true);
  }, []);

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setDefaultTier(undefined);
    // Don't clear triggerElement immediately to allow for exit animations
    setTimeout(() => {
      triggerElementRef.current = null;
    }, 300);
  }, []);

  return {
    isOpen,
    triggerElement: triggerElementRef.current,
    defaultTier,
    openPopover,
    closePopover,
  };
};