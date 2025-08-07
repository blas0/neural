import React, { forwardRef, ReactNode } from 'react';
import { componentVariants } from '../../utils/designSystem';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'base' | 'large';
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'data-section'?: string;
  style?: React.CSSProperties;
}

/**
 * Neural Design System Button Component
 * 
 * Provides consistent button styling across the application with multiple
 * variants, sizes, and states. Built with accessibility and design system
 * principles in mind.
 * 
 * @example
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Book a Call
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'base',
  children,
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  onClick,
  type = 'button',
  style,
  ...props
}, ref) => {
  const baseClasses = componentVariants.button[variant][size];
  
  // Add loading and disabled states
  const stateClasses = [
    loading && 'opacity-75 cursor-wait',
    disabled && 'opacity-50 cursor-not-allowed',
    'font-mono', // Ensure mono font is applied
  ].filter(Boolean).join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderIcon = () => {
    if (loading) return <LoadingSpinner />;
    if (!icon) return null;
    
    return (
      <span 
        className={`flex items-center ${
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`group ${baseClasses} ${stateClasses} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        ...style
      }}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span>{loading ? 'Loading...' : children}</span>
      {iconPosition === 'right' && !loading && renderIcon()}
    </button>
  );
});

Button.displayName = 'Button';

// Export arrow icon as a commonly used icon
export const ArrowRightIcon = () => (
  <svg 
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M17 8l4 4m0 0l-4 4m4-4H3" 
    />
  </svg>
);

export default Button;