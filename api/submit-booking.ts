import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import Airtable from 'airtable';
import { createHash } from 'crypto';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const emailLimitStore = new Map<string, { count: number; resetTime: number }>();

// Form validation schema
const BookingFormSchema = z.object({
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
    .toLowerCase(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[1-9]?[\d\s\(\)\-\.]+$/, 'Please enter a valid phone number'),
  
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  
  tier: z.enum(['tier-1', 'tier-2', 'tier-3'], {
    errorMap: () => ({ message: 'Please select a valid tier' })
  }),
  
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  
  honeypot: z.string().optional(),
  source: z.string().optional(),
  timestamp: z.string().optional()
});

// Security utilities
const hashIP = (ip: string): string => {
  const salt = process.env.HASH_SALT || 'default-salt';
  return createHash('sha256').update(ip + salt).digest('hex');
};

const hashEmail = (email: string): string => {
  const salt = process.env.HASH_SALT || 'default-salt';
  return createHash('sha256').update(email.toLowerCase() + salt).digest('hex');
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const key = hashIP(ip);
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + (15 * 60 * 1000) }); // 15 minutes
    return true;
  }

  if (limit.count >= 5) { // 5 submissions per 15 minutes
    return false;
  }

  limit.count++;
  return true;
};

const checkEmailLimit = (email: string): boolean => {
  const now = Date.now();
  const key = hashEmail(email);
  const limit = emailLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    emailLimitStore.set(key, { count: 1, resetTime: now + (24 * 60 * 60 * 1000) }); // 24 hours
    return true;
  }

  if (limit.count >= 3) { // 3 submissions per day per email
    return false;
  }

  limit.count++;
  return true;
};

const detectSpam = (data: any): boolean => {
  // Honeypot check
  if (data.honeypot && data.honeypot.trim() !== '') {
    return true;
  }

  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'congratulations',
    'click here', 'act now', 'limited time', 'guaranteed', 'free money',
    'make money fast', 'work from home', 'nigerian prince', 'investment opportunity'
  ];

  const combinedText = `${data.firstName} ${data.lastName} ${data.email} ${data.message || ''}`.toLowerCase();
  
  // Check for spam keywords
  const spamScore = spamKeywords.reduce((score, keyword) => {
    return score + (combinedText.includes(keyword) ? 1 : 0);
  }, 0);

  if (spamScore > 0) return true;
  if (data.message && (data.message.includes('http://') || data.message.includes('https://'))) return true;
  if (data.firstName.toLowerCase() === data.lastName.toLowerCase()) return true;
  
  return false;
};

const submitToAirtable = async (data: any) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || 'app8vyUe1sr8A2QlS';
  
  if (!apiKey) {
    throw new Error('Airtable API key missing');
  }

  const base = new Airtable({ apiKey }).base(baseId);
  
  // Using the table ID from your Airtable URL: tblGAQ6b4C2v7JfW8
  const table = base('tblGAQ6b4C2v7JfW8');

  try {
    // Map form data to match your Airtable field structure
    const fields: any = {
      'First Name': data.firstName,
      'Last Name': data.lastName, 
      'Email': data.email,
      'Phone Number': data.phone,
      'Website': data.website || '',
      'Tier': data.tier
    };

    // Only add optional fields if they have values
    // Note: Since we couldn't find message/status/source fields in your table,
    // we'll only submit the core contact information fields that exist

    const record = await table.create([{ fields }]);

    return { success: true, id: record[0].id };
  } catch (error) {
    console.error('Airtable submission failed:', error);
    throw new Error('Failed to submit to Airtable');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.headers['x-real-ip'] as string || 
                     req.socket?.remoteAddress || 
                     'unknown';

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Too many submissions from your IP address. Please try again later.'
      });
    }

    // Validate request body
    const validatedData = BookingFormSchema.parse(req.body);

    // Email rate limiting
    if (!checkEmailLimit(validatedData.email)) {
      return res.status(429).json({
        success: false,
        error: 'Email limit exceeded',
        message: 'This email address has submitted too many forms today. Please try again tomorrow.'
      });
    }

    // Spam detection
    if (detectSpam(validatedData)) {
      console.log('Spam detected:', { 
        email: validatedData.email, 
        ip: hashIP(clientIP),
        timestamp: new Date().toISOString() 
      });
      
      return res.status(400).json({
        success: false,
        error: 'Submission rejected',
        message: 'Your submission appears to be spam. Please contact us directly if this is an error.'
      });
    }

    // Add server metadata
    const submissionData = {
      ...validatedData,
      ipAddress: clientIP,
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date().toISOString()
    };

    // Submit to Airtable
    const result = await submitToAirtable(submissionData);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your submission! We\'ll be in touch within 24 hours.',
      id: result.id
    });

  } catch (error) {
    console.error('API error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your form data and try again.',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    if (error instanceof Error && error.message.includes('Airtable')) {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
        message: 'We\'re experiencing technical difficulties. Please try again later or contact us directly.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.'
    });
  }
}