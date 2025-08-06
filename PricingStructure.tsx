import React, { useState, useEffect } from 'react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  tagline: string;
  features: string[];
  isPopular?: boolean;
}

interface PricingStructureProps {
  className?: string;
}

const PricingStructure: React.FC<PricingStructureProps> = ({
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTiers, setVisibleTiers] = useState<boolean[]>([false, false, false]);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const staggerTimer = setTimeout(() => {
        [0, 1, 2].forEach((index) => {
          setTimeout(() => {
            setVisibleTiers(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 200);
        });
      }, 300);
      return () => clearTimeout(staggerTimer);
    }
  }, [isVisible]);

  const pricingTiers: PricingTier[] = [
    {
      id: 'tier-1',
      name: 'tier I',
      price: '$500+',
      description: 'essentials',
      tagline: 'the foundation of digital presence',
      features: [
        'custom landing page design',
        'brand identity integration',
        'mobile-responsive architecture',
        'performance optimization',
        'seo fundamentals',
        'professional typography & spacing',
        'brand color palette implementation',
        'basic analytics setup'
      ]
    },
    {
      id: 'tier-2',
      name: 'tier II',
      price: '$1000+',
      description: 'integrated systems',
      tagline: 'where strategy meets execution',
      features: [
        'everything in tier I',
        'lead generation optimization',
        'custom api integrations',
        'backend architecture design',
        'advanced analytics & tracking',
        'conversion rate optimization',
        'automated workflows',
        'third-party service connections',
        'database design & management'
      ],
      isPopular: true
    },
    {
      id: 'tier-3',
      name: 'tier III',
      price: 'custom',
      description: 'enterprise grade',
      tagline: 'for businesses that depend on digital excellence',
      features: [
        'everything in previous tiers',
        'custom software development',
        'advanced performance monitoring',
        'scalable infrastructure design',
        'multi-platform integration',
        'custom cms development',
        'dedicated development resources',
        'ongoing strategic consultation',
        'priority support & maintenance'
      ]
    }
  ];

  return (
    <div id="pricing" className={`w-full py-16 sm:py-20 lg:py-24 ${className}`} style={{ scrollMarginTop: '80px' }}>
      {/* Section Title */}
      <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}>
        <h3 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-zinc-800 mb-6 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          investment tiers
        </h3>
        <p 
          className="text-base sm:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
        >
          transparent pricing that scales with your ambition and business needs.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto pt-12">
          <div className="min-w-full rounded-lg shadow-lg relative" style={{ overflow: 'visible' }}>
            {/* Table Header */}
            <div className="bg-stone-50 border-b border-stone-200 rounded-t-lg">
              <div className="grid grid-cols-4 gap-0">
                <div className="p-6 border-r border-stone-200">
                  <h4 
                    className="text-sm font-medium text-zinc-500 uppercase tracking-wide"
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    features
                  </h4>
                </div>
                {pricingTiers.map((tier, index) => (
                  <div 
                    key={tier.id} 
                    className={`p-6 text-center relative ${
                      index < pricingTiers.length - 1 ? 'border-r border-stone-200' : ''
                    } ${tier.isPopular ? 'bg-zinc-50' : ''} transition-all duration-500 ease-out ${
                      visibleTiers[index] 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {tier.isPopular && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                        <span 
                          className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-lg"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          popular choice
                        </span>
                      </div>
                    )}
                    <div className="mb-2">
                      <h5 
                        className="text-xl font-bold text-zinc-800"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                      >
                        {tier.name}
                      </h5>
                      <p 
                        className="text-2xl font-bold text-zinc-900 mt-1"
                        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        {tier.price}
                      </p>
                    </div>
                    <p 
                      className="text-sm text-zinc-600 mb-2"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
                    >
                      {tier.description}
                    </p>
                    <p 
                      className="text-xs text-zinc-500 italic"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {tier.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Rows */}
            <div className="divide-y divide-stone-200">
              {/* Get all unique features */}
              {Array.from(new Set(pricingTiers.flatMap(tier => tier.features))).map((feature, featureIndex) => (
                <div 
                  key={feature} 
                  className={`grid grid-cols-4 gap-0 hover:bg-stone-25 transition-colors duration-200 ${
                    isVisible 
                      ? 'opacity-100' 
                      : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${featureIndex * 50}ms`
                  }}
                >
                  <div className="p-4 border-r border-stone-200 bg-stone-25">
                    <p 
                      className="text-sm text-zinc-700 font-medium"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {feature}
                    </p>
                  </div>
                  {pricingTiers.map((tier, tierIndex) => (
                    <div 
                      key={`${tier.id}-${feature}`} 
                      className={`p-4 text-center ${
                        tierIndex < pricingTiers.length - 1 ? 'border-r border-stone-200' : ''
                      } ${tier.isPopular ? 'bg-zinc-25' : ''}`}
                    >
                      {tier.features.includes(feature) ? (
                        <div className="flex justify-center">
                          <svg 
                            className="w-5 h-5 text-green-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg 
                            className="w-5 h-5 text-stone-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M6 18L18 6M6 6l12 12" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="bg-stone-50 border-t border-stone-200 rounded-b-lg">
              <div className="grid grid-cols-4 gap-0">
                <div className="p-6 border-r border-stone-200">
                  <p 
                    className="text-xs text-zinc-500 italic"
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    ready to begin?
                  </p>
                </div>
                {pricingTiers.map((tier, index) => (
                  <div 
                    key={`cta-${tier.id}`} 
                    className={`p-6 text-center ${
                      index < pricingTiers.length - 1 ? 'border-r border-stone-200' : ''
                    } ${tier.isPopular ? 'bg-zinc-50' : ''}`}
                  >
                    <button
                      className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        tier.isPopular
                          ? 'bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-600 hover:shadow-lg hover:scale-105'
                          : 'bg-white text-zinc-800 border border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-500'
                      }`}
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                      onClick={() => {
                        console.log(`Selected ${tier.name}`);
                      }}
                    >
                      book a call
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center">
          <p 
            className="text-xs text-zinc-500 italic max-w-2xl mx-auto"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            all tiers include ongoing support during development. final pricing determined after consultation and project scope assessment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingStructure;