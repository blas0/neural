import React, { useEffect, useState, useRef } from 'react';
import { ServicesOverviewProps, Service } from './ServicesOverview.types';

const ServicesOverview: React.FC<ServicesOverviewProps> = ({
  className = '',
  sectionTitle = "Our Website Services",
  onServiceCTA
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  const services: Service[] = [
    {
      id: "web-design",
      title: "Web Design & Development",
      description: "Custom, conversion-focused website design with mobile-responsive development that turns visitors into leads.",
      price: "Starting at $2,997",
      ctaText: "Get Design Quote",
      icon: "design",
      features: ["Custom Design", "Mobile Responsive", "Lead Focused"]
    },
    {
      id: "lead-generation",
      title: "Lead Generation Optimization",
      description: "Landing page optimization with A/B testing and conversion tracking to maximize your lead capture potential.",
      price: "Starting at $1,497/month",
      ctaText: "Boost My Conversions",
      icon: "optimization",
      features: ["A/B Testing", "Conversion Tracking", "Landing Pages"]
    },
    {
      id: "performance-seo",
      title: "Website Performance & SEO",
      description: "Speed optimization and technical SEO implementation to boost your search rankings and user experience.",
      price: "Starting at $997/month",
      ctaText: "Audit My Site",
      icon: "performance",
      features: ["Speed Optimization", "Technical SEO", "Performance Monitoring"]
    }
  ];

  // Sequential fade-in animation after value proposition section
  useEffect(() => {
    // Calculate timing: navbar(600) + hero(1000) + data noise(800) + overview section(400) + overview cards(5*150) = 3550ms
    const sectionTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3550);

    // Stagger service card animations after section is visible
    const cardTimer = setTimeout(() => {
      services.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 200);
      });
    }, 3750); // Start cards 200ms after section

    return () => {
      clearTimeout(sectionTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const getIcon = (iconType: string) => {
    const iconClasses = "w-10 h-10";
    
    switch (iconType) {
      case "design":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case "optimization":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "performance":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleServiceCTA = (serviceId: string) => {
    if (onServiceCTA) {
      onServiceCTA(serviceId);
    } else {
      console.log(`Service CTA clicked for: ${serviceId}`);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-20 lg:py-24 bg-stone-50 ${className}`}
      aria-labelledby="services-overview-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="services-overview-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-zinc-800 mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative bg-white rounded-xl p-8 shadow-sm border border-stone-200 transition-all duration-500 ease-out ${
                visibleCards[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-xl mb-6">
                <div className="text-zinc-800">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Content */}
              <h3 
                className="text-2xl sm:text-3xl font-bold text-zinc-800 mb-4 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {service.title}
              </h3>
              
              <p 
                className="text-zinc-600 leading-relaxed mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
              >
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-zinc-600">
                    <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              <div className="mb-6">
                <p 
                  className="text-xl sm:text-2xl font-bold text-zinc-800"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {service.price}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleServiceCTA(service.id)}
                className="w-full group-cta inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 ease-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                aria-label={`${service.ctaText} for ${service.title}`}
              >
                {service.ctaText}
                <svg 
                  className="ml-2 w-4 h-4 transition-transform duration-300 group-cta-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>

            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p 
                  className="text-lg sm:text-xl font-medium text-zinc-800"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Not sure which service is right for you? Let's talk about your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;