import React from 'react';
import HeroSection from '../../HeroSection';
import DataNoiseSection from '../components/DataNoiseSection';
import OverviewOfServices from '../../OverviewOfServices';
import WeatherTimeToast from '../../WeatherTimeToast';
import RoadmapJourney from '../../RoadmapJourney';
import PricingStructure from '../../PricingStructure';


const HomePage: React.FC = () => {
  const handleCTAClick = () => {
    console.log('CTA clicked - implement your booking logic here');
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked - implement your action here');
  };

  return (
    <div className="pt-16 sm:pt-20">
      <div className="fade-in-sequential fade-in-toast">
        <WeatherTimeToast />
      </div>
      <section id="top" className="fade-in-sequential fade-in-hero">
        <HeroSection onCTAClick={handleCTAClick} />
      </section>
      <div className="fade-in-sequential fade-in-noise">
        <DataNoiseSection />
      </div>
      <section id="about" className="fade-in-sequential fade-in-services">
        <OverviewOfServices onLearnMore={handleLearnMore} />
      </section>
      <section id="roadmap" className="fade-in-sequential fade-in-roadmap">
        <RoadmapJourney />
      </section>
      <section id="pricing" className="fade-in-sequential fade-in-pricing">
        <PricingStructure />
      </section>
      <footer className="fade-in-sequential fade-in-footer py-8 text-center text-sm text-stone-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="footer-animated">
            © 2025 neurix | made w luv in pdx, or
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;