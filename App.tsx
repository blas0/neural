import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './src/pages/HomePage';
import RoadmapPage from './RoadmapPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'roadmap'>('home');

  const handleLogoClick = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoadmapClick = () => {
    setCurrentPage('roadmap');
  };

  return (
    <div className="App bg-stone-50">
      <NavigationBar 
        onLogoClick={handleLogoClick} 
        onRoadmapClick={handleRoadmapClick}
      />
      {currentPage === 'home' ? <HomePage /> : <RoadmapPage />}
    </div>
  );
}

export default App;