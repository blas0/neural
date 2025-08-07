import { useEffect, useCallback } from 'react';
import { useNavigation } from '../utils/scrollUtils';

/**
 * Enhanced keyboard navigation hook that provides accessible keyboard shortcuts
 * and improves overall navigation experience
 */
export const useKeyboardNavigation = () => {
  const { scrollToTop, scrollToAbout, scrollToRoadmap, scrollToPricing } = useNavigation();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only handle keyboard shortcuts when not in form fields
    const activeElement = document.activeElement;
    const isInFormField = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.tagName === 'SELECT' ||
      activeElement.hasAttribute('contenteditable')
    );

    if (isInFormField) return;

    // Handle Escape key to close any open modals/popovers
    if (event.key === 'Escape') {
      const closeButton = document.querySelector('[data-close-modal], [data-close-popover]') as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
        event.preventDefault();
      }
    }

    // Handle navigation shortcuts (with Alt key to avoid conflicts)
    if (event.altKey) {
      switch (event.key.toLowerCase()) {
        case '1':
        case 'h':
          scrollToTop();
          event.preventDefault();
          break;
        case '2':
        case 'a':
          scrollToAbout();
          event.preventDefault();
          break;
        case '3':
        case 'r':
          scrollToRoadmap();
          event.preventDefault();
          break;
        case '4':
        case 'p':
          scrollToPricing();
          event.preventDefault();
          break;
      }
    }

    // Handle arrow key navigation for focus management
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const focusableElements = Array.from(document.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      )) as HTMLElement[];

      const currentIndex = focusableElements.findIndex(el => el === activeElement);
      
      if (currentIndex !== -1) {
        const nextIndex = event.key === 'ArrowDown' 
          ? (currentIndex + 1) % focusableElements.length
          : (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        
        const nextElement = focusableElements[nextIndex];
        if (nextElement) {
          nextElement.focus();
          event.preventDefault();
        }
      }
    }
  }, [scrollToTop, scrollToAbout, scrollToRoadmap, scrollToPricing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Skip link functionality for screen readers
  const createSkipLinks = useCallback(() => {
    const skipLinkContainer = document.getElementById('skip-links');
    if (skipLinkContainer) return; // Already exists

    const skipLinks = document.createElement('div');
    skipLinks.id = 'skip-links';
    skipLinks.className = 'sr-only focus-within:not-sr-only fixed top-0 left-0 z-50 bg-white p-4 shadow-lg';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link bg-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-zinc-600 mr-2">
        Skip to main content
      </a>
      <a href="#navigation" class="skip-link bg-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-zinc-600">
        Skip to navigation
      </a>
    `;

    document.body.insertBefore(skipLinks, document.body.firstChild);
  }, []);

  useEffect(() => {
    createSkipLinks();
  }, [createSkipLinks]);

  return {
    // Utility functions for components to use
    announceToScreenReader: (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    },
    
    // Focus management utilities
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      container.addEventListener('keydown', handleFocusTrap);
      firstElement?.focus();
      
      return () => container.removeEventListener('keydown', handleFocusTrap);
    }
  };
};