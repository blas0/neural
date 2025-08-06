import React from 'react';
import HeroSection from '../../HeroSection';
import DataNoiseSection from '../components/DataNoiseSection';
import OverviewOfServices from '../../OverviewOfServices';
import WeatherTimeToast from '../../WeatherTimeToast';


const HomePage: React.FC = () => {
  const handleCTAClick = () => {
    console.log('CTA clicked - implement your booking logic here');
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked - implement your action here');
  };

  return (
    <>
      <WeatherTimeToast />
      <HeroSection onCTAClick={handleCTAClick} />
      <DataNoiseSection />
      <OverviewOfServices onLearnMore={handleLearnMore} />
    </>
  );
};

export default HomePage;