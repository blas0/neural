import React, { useEffect, useState, useRef } from 'react';
import DesignImpactVisualization from './DesignImpactVisualization';
import { OverviewOfServicesProps, ServiceCard } from './OverviewOfServices.types';

const OverviewOfServices: React.FC<OverviewOfServicesProps> = ({
  className = '',
  sectionTitle = "an overview of services",
  onLearnMore
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  const serviceCards: ServiceCard[] = [
    {
      id: "what-we-do",
      title: "what we do",
      description: "we craft tailored visual websites that empower brands and founders to earn trust, gain momentum, and challenge the status quo."
    },
    {
      id: "how-it-helps",
      title: "how it helps",
      description: "we ensure your website makes a powerful first impression, one that resonates with the right audience and aligns with the quality of your offering and the ambition behind it."
    },
    {
      id: "who-its-for",
      title: "who it's for",
      description: "we're best suited for early-stage ventures looking to define their brand and digital presence... primarily in tech, lifestyle, finance, & e-com."
    },
    {
      id: "when-to-engage",
      title: "when to engage",
      description: "engage us when you're ready to stand apart, when indistinct, underperforming, or misaligned branding is no longer an option."
    },
    {
      id: "pricing",
      title: "pricing",
      description: "we don't charge by the hour. instead, we offer clear, fixed-rate packages designed to accommodate a variety of budgets and business needs."
    }
  ];

  // Sequential fade-in animation after hero section
  useEffect(() => {
    // Trigger section animation after hero + data noise section (2.4s total: 600ms navbar + 1000ms hero + 800ms data noise)
    const sectionTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2400);

    // Stagger card animations after section is visible
    const cardTimer = setTimeout(() => {
      serviceCards.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 150);
      });
    }, 2600); // Start cards 200ms after section

    return () => {
      clearTimeout(sectionTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    }
  };

  return (
    <section 
      id="overview-services"
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center py-16 sm:py-20 lg:py-24 bg-stone-50 ${className}`}
      aria-labelledby="overview-services-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="overview-services-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-zinc-800 mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
          {serviceCards.map((card, index) => (
            <div
              key={card.id}
              className={`transition-all duration-500 ease-out ${
                visibleCards[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Card Title */}
              <h3 
                className="text-lg sm:text-xl font-bold text-zinc-800 mb-4 leading-tight tracking-wide"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {card.title}
              </h3>
              
              {/* Card Description */}
              <p 
                className="text-zinc-600 leading-relaxed text-base sm:text-lg"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Research Insights Section */}
        {/* Data Visualization Section */}
        <div className={`mt-20 transition-all duration-1000 ease-out delay-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <DesignImpactVisualization 
            width={800} 
            height={500}
            className="w-full"
          />
        </div>

      </div>
    </section>
  );
};

export default OverviewOfServices;