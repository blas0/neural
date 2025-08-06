import React from 'react';
import TVStaticSection from './TVStaticSection';

/**
 * Demo component showcasing different variants of the TV Static Section
 * This is for development and demonstration purposes only
 */
const TVStaticSectionDemo: React.FC = () => {
  return (
    <div className="demo-container">
      {/* Default Configuration */}
      <TVStaticSection />
      
      {/* Custom Text Example */}
      <TVStaticSection 
        customText="Breaking through the digital chaos with purpose-driven design."
        heightVariant="small"
        animationDelay={800}
      />
      
      {/* Large Viewport Example */}
      <TVStaticSection 
        customText="Signal. Not noise."
        heightVariant="large"
        staticIntensity={0.6}
        animationDelay={1600}
      />
      
      {/* Reduced Motion Respect Example */}
      <TVStaticSection 
        customText="Accessible design for everyone."
        heightVariant="medium"
        respectReducedMotion={true}
        animationDelay={2000}
      />
      
      {/* High Intensity Static */}
      <TVStaticSection 
        customText="Maximum impact, minimum distraction."
        staticIntensity={1.0}
        heightVariant="small"
        animationDelay={2400}
      />
    </div>
  );
};

export default TVStaticSectionDemo;