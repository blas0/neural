import React, { lazy, useEffect } from 'react';
import HeroSection from '../../HeroSection';
import DataNoiseSection from '../components/DataNoiseSection';
import WeatherTimeToast from '../../WeatherTimeToast';
import LazySection from '../components/LazySection';
import { preloadCriticalChunks } from '../utils/preloadChunks';
import { SECTION_IDS } from '../utils/constants';

// Lazy load heavy components that aren't immediately visible
const OverviewOfServices = lazy(() => import('../../OverviewOfServices'));
const RoadmapJourney = lazy(() => import('../components/RoadmapJourney'));
const PricingStructure = lazy(() => import('../components/PricingStructure'));

interface HomePageProps {
  onBookCall: (element: HTMLElement, tier?: 'tier-1' | 'tier-2' | 'tier-3') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onBookCall }) => {
  // Preload chunks for better performance
  useEffect(() => {
    preloadCriticalChunks();
  }, []);

  const handleCTAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onBookCall(event.currentTarget);
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked - implement your action here');
  };

  return (
    <div className="w-full prevent-horizontal-scroll layout-stable">

      <section id={SECTION_IDS.TOP} className="fade-in-sequential fade-in-hero w-full prevent-horizontal-scroll">
        <HeroSection onCTAClick={handleCTAClick} />
      </section>
      <div className="w-full prevent-horizontal-scroll">
        <DataNoiseSection />
      </div>
      <section id={SECTION_IDS.ABOUT} className="w-full prevent-horizontal-scroll">
        <LazySection 
          height="min-h-[600px]"
          priority={true}
          loadingVariant="skeleton"
        >
          <OverviewOfServices onLearnMore={handleLearnMore} />
        </LazySection>
      </section>
      
      <section id={SECTION_IDS.ROADMAP} className="w-full prevent-horizontal-scroll">
        <LazySection 
          height="min-h-[400px]"
          loadingVariant="minimal"
        >
          <RoadmapJourney />
        </LazySection>
      </section>
      
      <section id={SECTION_IDS.PRICING} className="w-full prevent-horizontal-scroll">
        <LazySection 
          height="min-h-[800px]"
          loadingVariant="skeleton"
        >
          <PricingStructure onBookCall={onBookCall} />
        </LazySection>
      </section>
      <footer className="py-8 text-sm text-stone-400 w-full prevent-horizontal-scroll">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="footer-weather">
              <WeatherTimeToast />
            </div>
            <div className="footer-animated text-center flex-1">
              <span className="text-stone-400">© 2025 neurix</span>
              <span className="mx-2 text-stone-500">•</span>
              <span className="text-stone-300 font-medium tracking-wide">made w/ luv in pdx, or</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;