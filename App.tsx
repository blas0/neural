import React, { Suspense, lazy, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './src/pages/HomePage';
import { useBookingPopover } from './src/hooks/useBookingPopover';
import { useNavigation } from './src/utils/scrollUtils';
import { preloadOnInteraction } from './src/utils/preloadChunks';
import { useKeyboardNavigation } from './src/hooks/useKeyboardNavigation';

// Lazy load BookingPopover since it's not needed until user interaction
const LazyBookingPopover = lazy(() => import('./src/components/BookingPopover/BookingPopover'));

function App() {
  const { isOpen, animationState, triggerElement, defaultTier, openPopover, closePopover } = useBookingPopover();
  const { scrollToTop, scrollToAbout, scrollToRoadmap, scrollToPricing } = useNavigation();
  const { announceToScreenReader } = useKeyboardNavigation();

  // Initialize interaction-based preloading
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadOnInteraction();
    }, 1000); // Small delay to ensure DOM is fully loaded
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogoClick = async () => {
    await scrollToTop();
  };

  const handleRoadmapClick = async () => {
    await scrollToRoadmap();
  };

  const handlePricingClick = async () => {
    await scrollToPricing();
  };

  const handleAboutClick = async () => {
    await scrollToAbout();
  };

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openPopover(event.currentTarget);
  };

  return (
    <div className="App bg-stone-50 prevent-horizontal-scroll layout-stable">
      {/* Main landmark for accessibility */}
      <div id="navigation" role="navigation" aria-label="Main navigation" className="fade-in-sequential fade-in-nav layout-stable">
        <NavigationBar 
          onLogoClick={handleLogoClick} 
          onRoadmapClick={handleRoadmapClick}
          onPricingClick={handlePricingClick}
          onAboutClick={handleAboutClick}
          onCTAClick={handleCTAClick}
        />
      </div>
      
      <main id="main-content" role="main" aria-label="Main content" className="prevent-horizontal-scroll layout-stable">
        <HomePage onBookCall={openPopover} />
      </main>
      
      {/* Global Booking Popover - Only load when needed */}
      {(isOpen || animationState === 'closing') && (
        <Suspense fallback={<div aria-live="polite">Loading booking form...</div>}>
          <LazyBookingPopover 
            isOpen={isOpen}
            animationState={animationState}
            onClose={closePopover}
            triggerElement={triggerElement}
            defaultTier={defaultTier}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;