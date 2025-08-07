import React, { Suspense, ReactNode, memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  height?: string;
  /** Priority loading for above-the-fold content */
  priority?: boolean;
  /** Custom loading state with brand consistency */
  loadingVariant?: 'default' | 'minimal' | 'skeleton';
}

const LoadingFallback: React.FC<{ 
  height?: string; 
  variant?: 'default' | 'minimal' | 'skeleton' 
}> = memo(({ height = 'min-h-[500px]', variant = 'default' }) => {
  const loadingVariants = {
    default: (
      <div className={`flex items-center justify-center ${height} bg-stone-50`}>
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-stone-200 rounded-lg animate-bounce"></div>
          <div className="text-stone-500 font-medium font-mono">Loading...</div>
        </div>
      </div>
    ),
    minimal: (
      <div className={`${height} bg-stone-50 animate-pulse`} />
    ),
    skeleton: (
      <div className={`${height} bg-stone-50 p-8`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-5/6"></div>
            <div className="h-4 bg-stone-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    ),
  };

  return loadingVariants[variant];
});

LoadingFallback.displayName = 'LoadingFallback';

const LazySection: React.FC<LazySectionProps> = memo(({ 
  children, 
  fallback, 
  className = '', 
  height = 'min-h-[500px]',
  priority = false,
  loadingVariant = 'default'
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    // Reduce root margin for priority content to load faster
    rootMargin: priority ? '100px' : '200px',
    triggerOnce: true,
  });

  // For priority content, load immediately
  const shouldLoad = priority || isIntersecting;

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <Suspense fallback={fallback || <LoadingFallback height={height} variant={loadingVariant} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <LoadingFallback height={height} variant={loadingVariant} />
      )}
    </div>
  );
});

export default LazySection;