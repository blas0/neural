import { z } from 'zod';
import { BookingFormData, TierOption } from './BookingPopover.types';

// Form validation schema
export const bookingFormSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .refine(email => !email.includes('+spam') && !email.includes('+test'), 'Invalid email format'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[1-9]?[\d\s\(\)\-\.]+$/, 'Please enter a valid phone number'),
  
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  
  tier: z.enum(['tier-1', 'tier-2', 'tier-3']),
  
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  
  honeypot: z.string().optional()
});

// Tier options configuration
export const tierOptions: TierOption[] = [
  {
    value: 'tier-1',
    label: 'Tier I - Essential ($500+)',
    description: 'Perfect for startups and small businesses',
    price: '$500+'
  },
  {
    value: 'tier-2', 
    label: 'Tier II - Professional ($1000+)',
    description: 'Ideal for growing companies and advanced features',
    price: '$1000+'
  },
  {
    value: 'tier-3',
    label: 'Tier III - Enterprise (Custom)',
    description: 'Custom solutions for large organizations',
    price: 'Custom'
  }
];

// Spam detection utility
export const detectSpamContent = (data: BookingFormData): boolean => {
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'congratulations',
    'click here', 'act now', 'limited time', 'guaranteed', 'free money',
    'make money fast', 'work from home', 'nigerian prince'
  ];

  const combinedText = `${data.firstName} ${data.lastName} ${data.email} ${data.message || ''}`.toLowerCase();
  
  // Check for spam keywords
  const spamScore = spamKeywords.reduce((score, keyword) => {
    return score + (combinedText.includes(keyword) ? 1 : 0);
  }, 0);

  // Check for suspicious patterns
  if (spamScore > 0) return true;
  if (data.honeypot && data.honeypot.trim() !== '') return true;
  if (data.message && data.message.includes('http')) return true;
  if (data.firstName.toLowerCase() === data.lastName.toLowerCase()) return true;
  
  return false;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Sanitize form data
export const sanitizeFormData = (data: BookingFormData): BookingFormData => {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.replace(/[^\d\+\(\)\-\s\.]/g, ''),
    website: data.website?.trim() || '',
    tier: data.tier,
    message: data.message?.trim() || '',
    honeypot: data.honeypot || ''
  };
};

// Get tier label by value
export const getTierLabel = (tier: 'tier-1' | 'tier-2' | 'tier-3'): string => {
  const option = tierOptions.find(t => t.value === tier);
  return option?.label || tier;
};