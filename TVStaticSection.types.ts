export interface TVStaticSectionProps {
  /**
   * Optional CSS class name for additional styling
   */
  className?: string;
  
  /**
   * Custom text to display over the static background
   * @default "In a sea of noise, we design brands that transmit clarity and convert attention into action."
   */
  customText?: string;
  
  /**
   * Controls the intensity of the static animation (0-1)
   * @default 0.8
   */
  staticIntensity?: number;
  
  /**
   * Section height variant
   * @default "medium"
   */
  heightVariant?: 'small' | 'medium' | 'large' | 'viewport';
  
  /**
   * Animation delay for sequential page animations (in milliseconds)
   * @default 1200
   */
  animationDelay?: number;
  
  /**
   * Whether to respect user's reduced motion preference
   * @default true
   */
  respectReducedMotion?: boolean;
}