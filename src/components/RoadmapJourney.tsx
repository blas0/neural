import React, { useMemo, memo } from 'react';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';

// Roadmap data structure
interface RoadmapData {
  month: string;
  service: string;
  intensity: number;
  isActive: boolean;
  displayMonth: string;
  colorIndex?: number;
}

// Define gradient colors for website design progression (shadcn HSL format)
const websiteDesignColors = [
  'hsl(0 85% 87%)',   // red-200
  'hsl(32 98% 83%)',  // orange-200
  'hsl(48 97% 77%)',  // amber-200
  'hsl(60 95% 85%)',  // yellow-200
  'hsl(81 88% 80%)',  // lime-200
  'hsl(120 50% 80%)'  // green-200
];

// Generate roadmap data from May 2025 to December 2025
const generateRoadmapData = (): RoadmapData[] => {
  const months = [
    { key: 'may25', display: 'may 25', full: 'May 2025' },
    { key: 'jun25', display: 'jun 25', full: 'June 2025' },
    { key: 'jul25', display: 'jul 25', full: 'July 2025' },
    { key: 'aug25', display: 'aug 25', full: 'August 2025' },
    { key: 'sep25', display: 'sep 25', full: 'September 2025' },
    { key: 'oct25', display: 'oct 25', full: 'October 2025' },
    { key: 'nov25', display: 'nov 25', full: 'November 2025' },
    { key: 'dec25', display: 'dec 25', full: 'December 2025' }
  ];

  const services = [
    'website design',
    'software/app mvp design'
  ];

  const data: RoadmapData[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
  const currentYear = currentDate.getFullYear();

  months.forEach((month, monthIndex) => {
    services.forEach((service, serviceIndex) => {
      // Determine if this month/service combo is active
      let isActive = false;
      let intensity = 0;
      let colorIndex = 0;

      // May to current month = website design is active
      if (service === 'website design') {
        if (currentYear === 2025 && monthIndex <= (currentMonth - 4)) { // May is month 4 (0-indexed)
          isActive = true;
          intensity = 1; // Full intensity for gradient colors
          colorIndex = Math.min(monthIndex, websiteDesignColors.length - 1); // Map month to color index
        } else if (currentYear === 2025 && monthIndex === (currentMonth - 4 + 1)) {
          // Current transitional period
          isActive = true;
          intensity = 1;
          colorIndex = Math.min(monthIndex, websiteDesignColors.length - 1);
        }
      }

      // Current month to December = software/app mvp design (grayed out/future)
      if (service === 'software/app mvp design') {
        if (currentYear === 2025 && monthIndex >= (currentMonth - 4)) {
          isActive = false; // Future phase, not fully implemented
          intensity = 0.2 + (Math.random() * 0.3); // 20-50% intensity (grayed)
        }
      }

      data.push({
        month: month.key,
        service,
        intensity,
        isActive,
        displayMonth: month.display,
        colorIndex // Add color index to data
      });
    });
  });

  return data;
};

interface RoadmapJourneyProps {
  width?: number;
  height?: number;
  className?: string;
  fullscreen?: boolean;
}

const RoadmapJourney: React.FC<RoadmapJourneyProps> = memo(({
  width = 900,
  height = 200,
  className = '',
  fullscreen = false
}) => {

  const data = useMemo(() => generateRoadmapData(), []);

  // Responsive dimensions and margins
  const responsiveDimensions = useMemo(() => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    
    if (isMobile) {
      return {
        width: Math.min(windowWidth * 0.95, 400),
        height: 180,
        margin: { top: 30, right: 15, bottom: 50, left: 80 }
      };
    } else if (isTablet) {
      return {
        width: Math.min(windowWidth * 0.9, 700),
        height: 190,
        margin: { top: 35, right: 25, bottom: 55, left: 160 }
      };
    } else {
      return {
        width: Math.min(width, windowWidth * 0.8),
        height,
        margin: { top: 40, right: 40, bottom: 60, left: 250 }
      };
    }
  }, [width, height]);

  const { width: chartWidth, height: chartHeight, margin } = responsiveDimensions;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Get unique months and services for scales
  const months = Array.from(new Set(data.map(d => d.month)));
  const services = Array.from(new Set(data.map(d => d.service)));

  // Scales
  const xScale = scaleBand({
    domain: months,
    range: [0, innerWidth],
    padding: 0.1,
  });

  const yScale = scaleBand({
    domain: services,
    range: [0, innerHeight],
    padding: 0.2,
  });

  const colorScale = scaleLinear({
    domain: [0, 1],
    range: ['#F3F4F6', '#1F2937'], // Light gray to dark gray
  });

  // Get cell dimensions
  const cellWidth = xScale.bandwidth();
  const cellHeight = yScale.bandwidth();

  // Responsive font sizes
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  const fontSize = {
    title: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    labels: isMobile ? 10 : isTablet ? 11 : 12,
    timeline: isMobile ? 9 : isTablet ? 10 : 11
  };

  return (
    <div className={`w-full overflow-x-hidden ${fullscreen ? 'min-h-screen flex flex-col items-center justify-center bg-stone-50' : ''} ${className}`}>
      {/* Title */}
      <div className="mb-6 sm:mb-8 text-center px-4">
        <h3 
          className={`${fontSize.title} font-bold italic text-zinc-800 mb-4 sm:mb-6 leading-tight`}
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          our roadmap journey
        </h3>
      </div>

      {/* Heatmap Visualization */}
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-none overflow-x-auto px-4 lg:px-0">
          <div className="flex justify-center min-w-max">
            <svg width={chartWidth} height={chartHeight} className="max-w-none">
              <Group left={margin.left} top={margin.top}>
                {/* Heatmap */}
                {data.map((d, i) => (
                  <rect
                    key={`${d.month}-${d.service}`}
                    x={xScale(d.month) ?? 0}
                    y={yScale(d.service) ?? 0}
                    width={cellWidth}
                    height={cellHeight}
                    rx={isMobile ? 2 : 4}
                    fill={(() => {
                      const intensity = d.intensity;
                      if (!d.isActive) {
                        // Grayed out future phases
                        return `rgba(156, 163, 175, ${0.3 + intensity * 0.2})`;
                      }
                      // Website design gets gradient colors, others use default scale
                      if (d.service === 'website design' && d.colorIndex !== undefined) {
                        const color = websiteDesignColors[d.colorIndex];
                        return color;
                      }
                      // Active phases with full color
                      return colorScale(intensity);
                    })()}
                  />
                ))}

                {/* Month labels (X-axis) */}
                {months.map((month) => {
                  const displayMonth = data.find(d => d.month === month)?.displayMonth || month;
                  return (
                    <text
                      key={month}
                      x={(xScale(month) ?? 0) + cellWidth / 2}
                      y={innerHeight + (isMobile ? 15 : 20)}
                      textAnchor="middle"
                      fontSize={fontSize.labels}
                      fill="#6B7280"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {displayMonth}
                    </text>
                  );
                })}

                {/* Service labels (Y-axis) - Responsive positioning */}
                {services.map((service) => (
                  <text
                    key={service}
                    x={isMobile ? -15 : -30}
                    y={(yScale(service) ?? 0) + cellHeight / 2}
                    textAnchor="end"
                    dy="0.35em"
                    fontSize={fontSize.labels}
                    fill="#374151"
                    style={{ 
                      fontFamily: 'IBM Plex Mono, monospace', 
                      fontWeight: 500,
                      // Wrap text on mobile if needed
                      ...(isMobile && service.length > 15 ? { 
                        fontSize: '9px',
                        wordSpacing: '-0.1em'
                      } : {})
                    }}
                  >
                    {isMobile && service.length > 15 
                      ? service.split(' ').map((word, i) => (
                          <tspan key={i} x={-10} dy={i === 0 ? 0 : '1.2em'}>
                            {word}
                          </tspan>
                        ))
                      : service
                    }
                  </text>
                ))}

                {/* Timeline indicator line */}
                <line
                  x1={-5}
                  y1={innerHeight + (isMobile ? 30 : 35)}
                  x2={innerWidth + 5}
                  y2={innerHeight + (isMobile ? 30 : 35)}
                  stroke="#D1D5DB"
                  strokeWidth={1}
                />

                {/* Launch indicator */}
                <text
                  x={0}
                  y={innerHeight + (isMobile ? 45 : 50)}
                  textAnchor="start"
                  fontSize={fontSize.timeline}
                  fill="#9CA3AF"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontStyle: 'italic' }}
                >
                  {isMobile ? 'may 25' : 'launch may 2025'}
                </text>

                {/* Current phase indicator */}
                <text
                  x={innerWidth}
                  y={innerHeight + (isMobile ? 45 : 50)}
                  textAnchor="end"
                  fontSize={fontSize.timeline}
                  fill="#9CA3AF"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontStyle: 'italic' }}
                >
                  {isMobile ? 'ongoing' : 'ongoing development'}
                </text>
              </Group>
            </svg>
          </div>

          {/* Subtle note about future phases - responsive positioning */}
          <div className="mt-3 sm:mt-4 flex justify-center px-4 lg:px-0">
            <div 
              className="w-full max-w-sm sm:max-w-none"
              style={{ 
                ...(isMobile ? {} : { 
                  marginLeft: `${margin.left}px`, 
                  width: `${innerWidth}px` 
                })
              }}
            >
              <p 
                className={`text-xs text-zinc-500 italic text-center leading-tight ${isMobile ? 'px-2' : ''}`}
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {isMobile 
                  ? '* app mvp design in dev phase'
                  : '* software/app mvp design services are in development phase'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

RoadmapJourney.displayName = 'RoadmapJourney';

export default RoadmapJourney;