import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createHash } from 'crypto';

// Use dynamic import for Airtable to ensure compatibility
const getAirtable = async () => {
  const { default: Airtable } = await import('airtable');
  return Airtable;
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const emailLimitStore = new Map<string, { count: number; resetTime: number }>();

// Form validation schema
const BookingFormSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters'),
  
  website: z.string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid website URL'
    }),
  
  tier: z.enum(['tier-1', 'tier-2', 'tier-3'], {
    message: 'Please select a valid tier'
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
  
  // Enhanced environment debugging
  console.log('=== AIRTABLE ENVIRONMENT CHECK ===');
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('API Key first 10 chars:', apiKey?.substring(0, 10) || 'MISSING');
  console.log('Base ID:', baseId);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('AIRTABLE')));
  console.log('================================');
  
  if (!apiKey) {
    console.error('CRITICAL: Airtable API key is missing from environment variables');
    throw new Error('Airtable API key missing');
  }
  
  if (!baseId) {
    console.error('Airtable base ID is missing');
    throw new Error('Airtable base ID missing');
  }

  const Airtable = await getAirtable();
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

    // Enhanced field validation logging
    console.log('=== FIELD MAPPING DEBUG ===');
    console.log('Original form data:', JSON.stringify(data, null, 2));
    console.log('Mapped fields for Airtable:', JSON.stringify(fields, null, 2));
    console.log('Field types check:');
    Object.entries(fields).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value} = "${value}"`);
    });
    console.log('==========================');

    // Add message field if a Message field exists in Airtable (optional)
    if (data.message && data.message.trim()) {
      // Note: Add this field to your Airtable table if you want to store messages
      // fields['Message'] = data.message.trim();
      console.log('Message field skipped - not configured in Airtable table');
    }

    // Only add optional fields if they have values
    // Note: Since we couldn't find message/status/source fields in your table,
    // we'll only submit the core contact information fields that exist

    console.log('Submitting to Airtable with fields:', JSON.stringify(fields, null, 2));
    
    const record = await table.create([{ fields }]);

    console.log('Airtable submission successful:', record[0].id);
    return { success: true, id: record[0].id };
  } catch (error) {
    console.error('Airtable submission failed:', error);
    console.error('Failed with submitted data:', JSON.stringify(data, null, 2));
    
    // More specific error messages
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      if (error.message.includes('AUTHENTICATION_REQUIRED')) {
        throw new Error('Airtable authentication failed - invalid API key');
      }
      if (error.message.includes('NOT_FOUND')) {
        throw new Error('Airtable table or base not found');
      }
      if (error.message.includes('INVALID_REQUEST_UNKNOWN')) {
        throw new Error('Airtable field validation failed - check field names and types');
      }
      if (error.message.includes('INVALID_REQUEST_MISSING_FIELDS')) {
        throw new Error('Required fields missing in Airtable submission');
      }
      throw new Error(`Airtable error: ${error.message}`);
    }
    
    throw new Error('Failed to submit to Airtable');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Global error handler to ensure we always return JSON
  const handleError = (error: any, statusCode = 500) => {
    console.error('API handler error:', error);
    try {
      return res.status(statusCode).json({
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      });
    } catch (jsonError) {
      console.error('Failed to send JSON error response:', jsonError);
      return res.status(500).send('Internal server error');
    }
  };

  // Set JSON content type first
  res.setHeader('Content-Type', 'application/json');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
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

    // Enhanced logging for debugging
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Environment check - AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('Environment check - AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID);
    console.log('Client IP:', clientIP);
    console.log('User Agent:', req.headers['user-agent']);
    
    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Missing request body',
        message: 'Please provide form data'
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

    // Ensure we always return JSON, even for unexpected errors
    try {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Please check your form data and try again.',
          details: error.issues.map((e: z.ZodIssue) => ({
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

      // Handle missing environment variables
      if (error instanceof Error && error.message.includes('API key missing')) {
        return res.status(503).json({
          success: false,
          error: 'Service configuration error',
          message: 'Service is temporarily unavailable. Please try again later or contact support.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      });
    } catch (jsonError) {
      // Fallback if JSON serialization fails
      console.error('Failed to send JSON error response:', jsonError);
      res.status(500).send('Internal server error');
    }
  }
}