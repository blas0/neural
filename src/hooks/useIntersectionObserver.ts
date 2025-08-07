import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  /** Enable immediate loading on reduced motion preference */
  respectReducedMotion?: boolean;
}

interface IntersectionResult {
  isIntersecting: boolean;
  intersectionRatio: number;
  entry?: IntersectionObserverEntry;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true,
  respectReducedMotion = true,
}: UseIntersectionObserverProps = {}): [RefObject<HTMLDivElement>, boolean, IntersectionResult] => {
  const [result, setResult] = useState<IntersectionResult>({
    isIntersecting: false,
    intersectionRatio: 0,
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = respectReducedMotion && 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const newResult = {
      isIntersecting: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio,
      entry,
    };
    
    setResult(newResult);
    
    if (entry.isIntersecting && triggerOnce && observerRef.current) {
      observerRef.current.unobserve(entry.target);
      observerRef.current = null;
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, load immediately
    if (prefersReducedMotion) {
      setResult({
        isIntersecting: true,
        intersectionRatio: 1,
      });
      return;
    }

    // Support both single threshold and array of thresholds
    const observerOptions: IntersectionObserverInit = {
      threshold: Array.isArray(threshold) ? threshold : [threshold],
      rootMargin,
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);
    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, handleIntersection, prefersReducedMotion]);

  return [elementRef, result.isIntersecting, result];
};