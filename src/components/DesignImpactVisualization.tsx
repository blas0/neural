import React, { useMemo, memo } from 'react';

// More specific imports to enable better tree shaking
import { AreaStack } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { curveBasis } from '@visx/curve';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';

// Research-based data for design impact visualization
// Time periods in seconds for various user impressions and decision points
const rawData = [
  // Time: 0-0.05s - Instant visual processing
  {
    time: 0.05,
    firstImpressions: 85, // 94% of first impressions are design-related (high impact)
    websiteVisuals: 75,   // Strong visual impact in first milliseconds
    websiteSeo: 5,        // No SEO impact in initial moments
    genEngineOpt: 8,      // Minimal AI/search impact initially
    loadSpeed: 95         // Critical - 100ms delay = 7% conversion loss
  },
  // Time: 0.5s - Sub-second decision making
  {
    time: 0.5,
    firstImpressions: 78,
    websiteVisuals: 82,   
    websiteSeo: 15,       
    genEngineOpt: 20,     
    loadSpeed: 88         // Still critical period for loading
  },
  // Time: 1s - One second mark (critical threshold)
  {
    time: 1,
    firstImpressions: 70, // Decisions forming
    websiteVisuals: 85,   // Visual appeal solidifying
    websiteSeo: 25,       // Some search context awareness
    genEngineOpt: 35,     // AI recommendations starting to influence
    loadSpeed: 75         // Every 1s improvement = 2% conversion increase (Walmart)
  },
  // Time: 2s - Two second threshold (47% expect under 2s)
  {
    time: 2,
    firstImpressions: 60,
    websiteVisuals: 80,
    websiteSeo: 40,
    genEngineOpt: 50,
    loadSpeed: 60         // Critical threshold - many users expect under 2s
  },
  // Time: 3s - Three second mark (40% leave after 3s)
  {
    time: 3,
    firstImpressions: 45, // Decisions largely made
    websiteVisuals: 70,   
    websiteSeo: 55,       // SEO impact becoming relevant
    genEngineOpt: 65,     // AI/search optimization gaining importance
    loadSpeed: 40         // 40% of users leave if site takes over 3s
  },
  // Time: 5s - Five second mark
  {
    time: 5,
    firstImpressions: 30,
    websiteVisuals: 60,
    websiteSeo: 70,       // SEO becomes more important for engagement
    genEngineOpt: 75,     
    loadSpeed: 25         // Significant abandonment beyond 5s
  },
  // Time: 10s - Extended engagement
  {
    time: 10,
    firstImpressions: 15, // Initial impressions fade
    websiteVisuals: 45,   
    websiteSeo: 85,       // SEO drives sustained engagement
    genEngineOpt: 90,     // AI optimization crucial for retention
    loadSpeed: 10         // Speed less critical but still impacts UX
  },
  // Time: 30s - Deep engagement phase
  {
    time: 30,
    firstImpressions: 5,  
    websiteVisuals: 35,   
    websiteSeo: 95,       // SEO critical for content discovery
    genEngineOpt: 95,     // AI optimization crucial for conversions
    loadSpeed: 5          // Ongoing performance still matters
  }
];

// Define keys for the stacked areas
const keys = ['firstImpressions', 'websiteVisuals', 'websiteSeo', 'genEngineOpt', 'loadSpeed'];
type DataKey = typeof keys[number];

// Color mappings with mesh gradient hues
const colors: Record<DataKey, { start: string; end: string }> = {
  firstImpressions: { start: '#FFE66D', end: '#FF6B6B' }, // Yellow to Red gradient
  websiteVisuals: { start: '#4ECDC4', end: '#45B7D1' },   // Teal to Blue gradient  
  websiteSeo: { start: '#96CEB4', end: '#FFEAA7' },       // Green to Yellow gradient
  genEngineOpt: { start: '#DDA0DD', end: '#98D8C8' },     // Purple to Mint gradient
  loadSpeed: { start: '#FF7675', end: '#FD79A8' }         // Red to Pink gradient
};

// Accessor functions
const getX = (d: typeof rawData[0]) => d.time;

interface DesignImpactVisualizationProps {
  width?: number;
  height?: number;
  className?: string;
}

const DesignImpactVisualization: React.FC<DesignImpactVisualizationProps> = memo(({
  width: propWidth,
  height: propHeight,
  className = ''
}) => {
  
  // Use responsive dimensions with fallback to props
  const { width, height, isMobile, isTablet } = useResponsiveDimensions(
    propWidth || 800, 
    propHeight || 500
  );


  // Enhanced responsive dimensions and margins for better mobile display
  const margin = useMemo(() => {
    if (isMobile) {
      return { top: 25, right: 15, bottom: 45, left: 35 };
    } else if (isTablet) {
      return { top: 30, right: 25, bottom: 50, left: 45 };
    } else {
      return { top: 40, right: 40, bottom: 60, left: 60 };
    }
  }, [isMobile, isTablet]);
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(
    () => scaleTime({
      domain: [0, Math.max(...rawData.map(getX))],
      range: [0, innerWidth],
    }),
    [innerWidth]
  );

  const yScale = useMemo(
    () => scaleLinear({
      domain: [0, 100],
      range: [innerHeight, 0],
    }),
    [innerHeight]
  );

  // Use raw data directly without animation
  const animatedData = rawData;

  return (
    <div className={`w-full ${className}`}>
      {/* Title and Description */}
      <div className="mb-8 text-center">
        <h3 
          className="text-2xl sm:text-3xl md:text-4xl font-bold italic text-zinc-800 mb-4 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          the data behind design impact
        </h3>
        <p 
          className="text-base sm:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
        >
          research-backed insights on how website design elements influence user behavior and conversion rates over time.
        </p>
      </div>

      {/* Visualization Container - Improved mobile layout */}
      <div className="flex justify-center items-start overflow-x-auto px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 space-y-6 lg:space-y-0 w-full max-w-6xl">
          {/* Main Chart - Ensure proper containment */}
          <div className="flex-shrink-0 w-full lg:w-auto overflow-visible">
            <svg width={width} height={height} className="max-w-full h-auto">
              {/* Define gradients */}
              <defs>
                {keys.map((key) => (
                  <LinearGradient
                    key={key}
                    id={`gradient-${key}`}
                    from={colors[key].start}
                    to={colors[key].end}
                    fromOpacity={0.8}
                    toOpacity={0.6}
                  />
                ))}
              </defs>

              <Group left={margin.left} top={margin.top}>
                {/* Stacked Areas */}
                <AreaStack
                  data={animatedData}
                  keys={keys}
                  x={(d) => xScale(getX(d.data))}
                  y0={(d) => yScale(d[0])}
                  y1={(d) => yScale(d[1])}
                  curve={curveBasis}
                >
                  {({ stacks, path }) =>
                    stacks.map((stack) => (
                      <path
                        key={`stack-${stack.key}`}
                        d={path(stack) || ''}
                        fill={`url(#gradient-${stack.key})`}
                        stroke="none"
                        strokeWidth={0}
                      />
                    ))
                  }
                </AreaStack>

                {/* X-axis */}
                <line
                  x1={0}
                  y1={innerHeight}
                  x2={innerWidth}
                  y2={innerHeight}
                  stroke="#374151"
                  strokeWidth={1}
                />

                {/* Y-axis */}
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={innerHeight}
                  stroke="#374151"
                  strokeWidth={1}
                />

                {/* X-axis labels - Simplified for mobile */}
                {(isMobile ? [0, 2, 5, 30] : [0, 1, 2, 3, 5, 10, 30]).map((time) => (
                  <g key={time}>
                    <line
                      x1={xScale(time)}
                      y1={innerHeight}
                      x2={xScale(time)}
                      y2={innerHeight + 5}
                      stroke="#374151"
                      strokeWidth={1}
                    />
                    <text
                      x={xScale(time)}
                      y={innerHeight + 20}
                      textAnchor="middle"
                      fontSize={isMobile ? 10 : 12}
                      fill="#6B7280"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {time}s
                    </text>
                  </g>
                ))}

                {/* Y-axis labels - Simplified for mobile */}
                {(isMobile ? [0, 50, 100] : [0, 25, 50, 75, 100]).map((value) => (
                  <g key={value}>
                    <line
                      x1={-5}
                      y1={yScale(value)}
                      x2={0}
                      y2={yScale(value)}
                      stroke="#374151"
                      strokeWidth={1}
                    />
                    <text
                      x={-10}
                      y={yScale(value)}
                      textAnchor="end"
                      dy="0.35em"
                      fontSize={isMobile ? 10 : 12}
                      fill="#6B7280"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {value}%
                    </text>
                  </g>
                ))}

                {/* Axis titles - Hide on mobile to save space */}
                {!isMobile && (
                  <>
                    <text
                      x={innerWidth / 2}
                      y={innerHeight + 45}
                      textAnchor="middle"
                      fontSize={14}
                      fill="#374151"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}
                    >
                      time (seconds)
                    </text>

                    <text
                      x={-45}
                      y={innerHeight / 2}
                      textAnchor="middle"
                      fontSize={14}
                      fill="#374151"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}
                      transform={`rotate(-90, -45, ${innerHeight / 2})`}
                    >
                      impact percentage
                    </text>
                  </>
                )}
              </Group>
            </svg>
          </div>

          {/* Responsive Legend - Better mobile display */}
          <div className="flex flex-col lg:pt-8 w-full lg:w-auto lg:min-w-max">
            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4 px-2 lg:px-0 justify-items-center sm:justify-items-start">
              {keys.map((key) => {
                const labels: Record<DataKey, string> = {
                  firstImpressions: 'first impressions',
                  websiteVisuals: 'website visuals/frontend ux',
                  websiteSeo: 'website seo',
                  genEngineOpt: 'generative engine optimization',
                  loadSpeed: 'load times/speed'
                };

                return (
                  <div key={key} className="flex items-center space-x-2 lg:space-x-3 min-w-0 whitespace-nowrap lg:whitespace-normal">
                    <div
                      className="w-3 h-3 lg:w-4 lg:h-4 rounded flex-shrink-0"
                      style={{
                        background: `linear-gradient(45deg, ${colors[key as DataKey].start}, ${colors[key as DataKey].end})`
                      }}
                    />
                    <span
                      className="text-xs lg:text-sm text-zinc-700 truncate"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {labels[key as DataKey]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key insights below visualization - Enhanced mobile responsiveness */}
      <div className="mt-8 sm:mt-12 text-center px-2">
        <div 
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-zinc-600"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {isMobile ? (
            // Mobile: Stack vertically with better spacing and ensure "100ms" is visible
            <>
              <div className="text-center leading-relaxed">
                <strong className="text-zinc-800">0.05s:</strong> 94% of first impressions are design-related
              </div>
              <div className="text-center leading-relaxed whitespace-nowrap">
                <strong className="text-zinc-800">100 ms:</strong> delay can reduce conversions by 7%
              </div>
              <div className="text-center leading-relaxed">
                <strong className="text-zinc-800">3s:</strong> 40% of users leave if slow
              </div>
            </>
          ) : (
            // Desktop: Show all insights in a row
            <>
              <div className="whitespace-nowrap">
                <strong className="text-zinc-800">0.05s:</strong> 94% of first impressions are design-related
              </div>
              <div className="whitespace-nowrap">
                <strong className="text-zinc-800">3s:</strong> 40% of users leave if page takes longer to load
              </div>
              <div className="whitespace-nowrap">
                <strong className="text-zinc-800">100 ms:</strong> delay can reduce conversions by 7%
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

DesignImpactVisualization.displayName = 'DesignImpactVisualization';

export default DesignImpactVisualization;