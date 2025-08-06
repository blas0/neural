import React from 'react';
import NavigationBar from './NavigationBar';
import RoadmapJourney from './RoadmapJourney';

const RoadmapPage: React.FC = () => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <NavigationBar onLogoClick={handleLogoClick} />
      <div className="pt-16 sm:pt-20"> {/* Account for fixed navbar height */}
        <RoadmapJourney 
          width={1200} 
          height={400}
          fullscreen={true}
          className="px-4 sm:px-6 lg:px-8"
        />
      </div>
    </div>
  );
};

export default RoadmapPage;