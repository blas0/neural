export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website?: string;
  tier: 'tier-1' | 'tier-2' | 'tier-3';
  message?: string;
  honeypot?: string; // Hidden field for spam detection
}

export type AnimationState = 'closed' | 'opening' | 'open' | 'closing';

export type AnimationPhase = 'enter' | 'exit';

export interface AnimationConfig {
  duration: {
    enter: number;
    exit: number;
  };
  easing: {
    enter: string;
    exit: string;
  };
}

export interface BookingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement: HTMLElement | null;
  defaultTier?: 'tier-1' | 'tier-2' | 'tier-3';
  animationState?: AnimationState;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface FormError {
  field: keyof BookingFormData;
  message: string;
}

export type TierOption = {
  value: 'tier-1' | 'tier-2' | 'tier-3';
  label: string;
  description: string;
  price: string;
};