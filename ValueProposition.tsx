import React, { useEffect, useState, useRef } from 'react';
import { ValuePropositionProps, Differentiator } from './ValueProposition.types';

const ValueProposition: React.FC<ValuePropositionProps> = ({
  className = '',
  sectionTitle = "Why Choose Our Web Design Services",
  guaranteeText = "30-day money-back guarantee - if you're not completely satisfied",
  onLearnMore
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  const differentiators: Differentiator[] = [
    {
      id: "conversion",
      title: "Conversion-Focused Design",
      description: "We don't just make pretty websites, we create lead-generating machines",
      icon: "target"
    },
    {
      id: "performance",
      title: "Lightning Fast Performance", 
      description: "Your site will load in under 3 seconds, keeping visitors engaged",
      icon: "lightning"
    },
    {
      id: "mobile",
      title: "Mobile-First Approach",
      description: "60% of your traffic is mobile - we design for phones first",
      icon: "mobile"
    },
    {
      id: "support",
      title: "Ongoing Support",
      description: "We don't disappear after launch - continuous optimization and support",
      icon: "support"
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
      differentiators.forEach((_, index) => {
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

  const getIcon = (iconType: string) => {
    const iconClasses = "w-8 h-8";
    
    switch (iconType) {
      case "target":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <circle cx="12" cy="12" r="6" strokeWidth={2} />
            <circle cx="12" cy="12" r="2" strokeWidth={2} />
          </svg>
        );
      case "lightning":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "mobile":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth={2} />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2} />
          </svg>
        );
      case "support":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-20 lg:py-24 bg-stone-50 ${className}`}
      aria-labelledby="value-proposition-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="value-proposition-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-zinc-800 mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {differentiators.map((item, index) => (
            <div
              key={item.id}
              className={`relative bg-white rounded-xl p-6 shadow-sm border border-stone-200 transition-all duration-500 ease-out ${
                visibleCards[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-lg mb-4">
                <div className="text-zinc-800">
                  {getIcon(item.icon)}
                </div>
              </div>

              {/* Content */}
              <h3 
                className="text-xl sm:text-2xl font-bold text-zinc-800 mb-3 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {item.title}
              </h3>
              <p 
                className="text-zinc-600 leading-relaxed"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
              >
                {item.description}
              </p>

            </div>
          ))}
        </div>

        {/* Before/After Mockup Section */}
        <div className={`bg-white rounded-2xl p-8 shadow-sm border border-stone-200 mb-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          <div className="text-center mb-8">
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl font-bold italic text-zinc-800 mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Website Transformation
            </h3>
            <p 
              className="text-lg text-zinc-600"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
            >
              See the difference our approach makes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Before */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 mb-4 border-2 border-red-200">
                <div className="bg-red-200 rounded h-32 flex items-center justify-center mb-4">
                  <span className="text-red-600 font-medium">Slow Loading</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-red-300 rounded h-3 w-3/4 mx-auto"></div>
                  <div className="bg-red-300 rounded h-3 w-1/2 mx-auto"></div>
                </div>
              </div>
              <h4 
                className="text-xl font-bold text-zinc-800 mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Before: 7+ seconds
              </h4>
              <p className="text-zinc-600 text-sm">High bounce rate, poor UX</p>
            </div>

            {/* After */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 mb-4 border-2 border-green-200">
                <div className="bg-green-200 rounded h-32 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-medium">Lightning Fast</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-400 rounded h-3 w-full mx-auto"></div>
                  <div className="bg-green-400 rounded h-3 w-5/6 mx-auto"></div>
                </div>
              </div>
              <h4 
                className="text-xl font-bold text-zinc-800 mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                After: Under 3 seconds
              </h4>
              <p className="text-zinc-600 text-sm">Higher conversions, better UX</p>
            </div>
          </div>

          {/* Improvement Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-stone-200">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">3x</div>
              <p className="text-zinc-600 text-sm">Faster Load Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">2.5x</div>
              <p className="text-zinc-600 text-sm">Higher Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">95+</div>
              <p className="text-zinc-600 text-sm">Mobile Performance Score</p>
            </div>
          </div>
        </div>

        {/* Risk Reversal/Guarantee */}
        <div className={`text-center transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p 
                  className="text-lg sm:text-xl font-medium text-zinc-800"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {guaranteeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;