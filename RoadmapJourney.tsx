import React, { useMemo, useState, useEffect, memo } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.03;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const data = useMemo(() => generateRoadmapData(), []);

  // Dimensions and margins
  const margin = { top: 40, right: 40, bottom: 60, left: 220 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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

  return (
    <div className={`w-full ${fullscreen ? 'min-h-screen flex flex-col items-center justify-center bg-stone-50' : ''} ${className}`}>
      {/* Title */}
      <div className="mb-8 text-center">
        <h3 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-zinc-800 mb-6 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          our roadmap journey
        </h3>
      </div>

      {/* Heatmap Visualization */}
      <div className="flex justify-center">
        <div className="relative" style={{ marginLeft: '-40px' }}>
          <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
              {/* Heatmap */}
              {data.map((d, i) => (
                <rect
                  key={`${d.month}-${d.service}`}
                  x={xScale(d.month) ?? 0}
                  y={yScale(d.service) ?? 0}
                  width={cellWidth}
                  height={cellHeight}
                  rx={4}
                  fill={(() => {
                    const intensity = d.intensity * animationProgress;
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
                  opacity={isVisible ? 1 : 0}
                  style={{
                    transition: 'opacity 1s ease-in-out'
                  }}
                />
              ))}

              {/* Month labels (X-axis) */}
              {months.map((month) => {
                const displayMonth = data.find(d => d.month === month)?.displayMonth || month;
                return (
                  <text
                    key={month}
                    x={(xScale(month) ?? 0) + cellWidth / 2}
                    y={innerHeight + 20}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#6B7280"
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {displayMonth}
                  </text>
                );
              })}

              {/* Service labels (Y-axis) */}
              {services.map((service) => (
                <text
                  key={service}
                  x={-20}
                  y={(yScale(service) ?? 0) + cellHeight / 2}
                  textAnchor="end"
                  dy="0.35em"
                  fontSize={12}
                  fill="#374151"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500 }}
                >
                  {service}
                </text>
              ))}

              {/* Timeline indicator line */}
              <line
                x1={-5}
                y1={innerHeight + 35}
                x2={innerWidth + 5}
                y2={innerHeight + 35}
                stroke="#D1D5DB"
                strokeWidth={1}
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: 'opacity 1s ease-in-out'
                }}
              />

              {/* Launch indicator */}
              <text
                x={0}
                y={innerHeight + 50}
                textAnchor="start"
                fontSize={11}
                fill="#9CA3AF"
                style={{ fontFamily: 'IBM Plex Mono, monospace', fontStyle: 'italic' }}
              >
                launch may 2025
              </text>

              {/* Current phase indicator */}
              <text
                x={innerWidth}
                y={innerHeight + 50}
                textAnchor="end"
                fontSize={11}
                fill="#9CA3AF"
                style={{ fontFamily: 'IBM Plex Mono, monospace', fontStyle: 'italic' }}
              >
                ongoing development
              </text>
            </Group>
          </svg>

          {/* Subtle note about future phases - centered to chart area */}
          <div className="mt-4 flex justify-center">
            <div style={{ marginLeft: `${margin.left}px`, width: `${innerWidth}px` }}>
              <p 
                className="text-xs text-zinc-500 italic text-center"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                * software/app mvp design services are in development phase
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