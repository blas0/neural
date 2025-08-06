import React from 'react';
import HeroSection from '../../HeroSection';
import DataNoiseSection from '../components/DataNoiseSection';
import OverviewOfServices from '../../OverviewOfServices';
import WeatherTimeToast from '../../WeatherTimeToast';
import RoadmapJourney from '../../RoadmapJourney';
import PricingStructure from '../../PricingStructure';

interface HomePageProps {
  onBookCall: (element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onBookCall }) => {
  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onBookCall(event.currentTarget);
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked - implement your action here');
  };

  return (
    <div className="pt-16 sm:pt-20">

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
        <PricingStructure onBookCall={onBookCall} />
      </section>
      <footer className="fade-in-sequential fade-in-footer py-8 text-sm text-stone-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="footer-weather">
              <WeatherTimeToast />
            </div>
            <div className="footer-animated text-center flex-1">
              © 2025 neurix | made w luv in pdx, or
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;