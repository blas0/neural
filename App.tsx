import React from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './src/pages/HomePage';
import { BookingPopover } from './src/components/BookingPopover';
import { useBookingPopover } from './src/hooks/useBookingPopover';

function App() {
  const { isOpen, triggerElement, defaultTier, openPopover, closePopover } = useBookingPopover();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate navbar height based on screen size
      const navbarHeight = window.innerWidth >= 640 ? 80 : 64; // sm:h-20 (80px) or h-16 (64px)
      
      // Get element position and calculate offset
      const offsetTop = element.offsetTop - navbarHeight;
      
      // Ensure we don't scroll above the top of the page
      const scrollTop = Math.max(0, offsetTop);
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Element with id "${sectionId}" not found`);
    }
  };

  const handleLogoClick = () => {
    scrollToSection('top');
  };

  const handleRoadmapClick = () => {
    scrollToSection('roadmap');
  };

  const handlePricingClick = () => {
    scrollToSection('pricing');
  };

  const handleAboutClick = () => {
    scrollToSection('about');
  };

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openPopover(event.currentTarget);
  };

  return (
    <div className="App bg-stone-50">
      <NavigationBar 
        onLogoClick={handleLogoClick} 
        onRoadmapClick={handleRoadmapClick}
        onPricingClick={handlePricingClick}
        onAboutClick={handleAboutClick}
        onCTAClick={handleCTAClick}
      />
      <HomePage onBookCall={openPopover} />
      
      {/* Global Booking Popover */}
      <BookingPopover 
        isOpen={isOpen}
        onClose={closePopover}
        triggerElement={triggerElement}
        defaultTier={defaultTier}
      />
    </div>
  );
}

export default App;