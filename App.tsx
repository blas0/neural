import React from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './src/pages/HomePage';


function App() {
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

  return (
    <div className="App bg-stone-50">
      <NavigationBar 
        onLogoClick={handleLogoClick} 
        onRoadmapClick={handleRoadmapClick}
        onPricingClick={handlePricingClick}
        onAboutClick={handleAboutClick}
      />
      <HomePage />
    </div>
  );
}

export default App;