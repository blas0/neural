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

export interface BookingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement: HTMLElement | null;
  defaultTier?: 'tier-1' | 'tier-2' | 'tier-3';
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