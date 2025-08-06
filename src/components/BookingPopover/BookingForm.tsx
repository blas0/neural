import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingFormData, FormSubmissionResponse } from './BookingPopover.types';
import { bookingFormSchema, tierOptions, detectSpamContent, sanitizeFormData } from './BookingPopover.utils';

interface BookingFormProps {
  defaultTier?: 'tier-1' | 'tier-2' | 'tier-3';
  onSuccess: (response: FormSubmissionResponse) => void;
  onError: (error: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ defaultTier, onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      tier: defaultTier || 'tier-1',
      honeypot: ''
    }
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Sanitize and validate data
      const sanitizedData = sanitizeFormData(data);
      
      // Client-side spam detection
      if (detectSpamContent(sanitizedData)) {
        throw new Error('Submission flagged as potential spam');
      }

      // Submit to API
      const response = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sanitizedData,
          source: window.location.pathname,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: FormSubmissionResponse = await response.json();
      
      // Reset form on success
      reset();
      onSuccess(result);

    } catch (error) {
      console.error('Form submission error:', error);
      onError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTier = watch('tier');
  const selectedTierData = tierOptions.find(tier => tier.value === selectedTier);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input
        {...register('honeypot')}
        type="text"
        autoComplete="off"
        tabIndex={-1}
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          opacity: 0,
          height: 0,
          width: 0
        }}
        aria-hidden="true"
      />

      {/* Name Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 mb-2">
            First Name *
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            autoComplete="given-name"
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
              errors.firstName 
                ? 'border-red-300 bg-red-50' 
                : 'border-zinc-300 bg-white hover:border-zinc-400'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600 font-mono">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 mb-2">
            Last Name *
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            autoComplete="family-name"
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
              errors.lastName 
                ? 'border-red-300 bg-red-50' 
                : 'border-zinc-300 bg-white hover:border-zinc-400'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600 font-mono">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Contact Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
              errors.email 
                ? 'border-red-300 bg-red-50' 
                : 'border-zinc-300 bg-white hover:border-zinc-400'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-mono">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            autoComplete="tel"
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
              errors.phone 
                ? 'border-red-300 bg-red-50' 
                : 'border-zinc-300 bg-white hover:border-zinc-400'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 font-mono">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Website Field */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-zinc-700 mb-2">
          Website <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          {...register('website')}
          type="url"
          id="website"
          autoComplete="url"
          className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
            errors.website 
              ? 'border-red-300 bg-red-50' 
              : 'border-zinc-300 bg-white hover:border-zinc-400'
          }`}
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="mt-1 text-xs text-red-600 font-mono">{errors.website.message}</p>
        )}
      </div>

      {/* Tier Selection */}
      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-zinc-700 mb-2">
          Project Tier *
        </label>
        <select
          {...register('tier')}
          id="tier"
          className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
            errors.tier 
              ? 'border-red-300 bg-red-50' 
              : 'border-zinc-300 bg-white hover:border-zinc-400'
          }`}
        >
          {tierOptions.map((tier) => (
            <option key={tier.value} value={tier.value}>
              {tier.label}
            </option>
          ))}
        </select>
        {selectedTierData && (
          <p className="mt-1 text-xs text-zinc-600 font-mono">
            {selectedTierData.description}
          </p>
        )}
        {errors.tier && (
          <p className="mt-1 text-xs text-red-600 font-mono">{errors.tier.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
          Project Details <span className="text-zinc-500">(optional)</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg font-mono text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent ${
            errors.message 
              ? 'border-red-300 bg-red-50' 
              : 'border-zinc-300 bg-white hover:border-zinc-400'
          }`}
          placeholder="Tell us about your project, goals, and timeline..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600 font-mono">{errors.message.message}</p>
        )}
        <p className="mt-1 text-xs text-zinc-500 font-mono">
          Note: Core contact info will be saved to Airtable. Project details will be included in our initial discussion.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 rounded-lg font-mono text-sm font-medium transition-all duration-200 ${
            isSubmitting
              ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed'
              : 'bg-zinc-800 text-white hover:bg-zinc-900 hover:shadow-lg active:transform active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-zinc-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              submitting...
            </span>
          ) : (
            'book consultation'
          )}
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="pt-2">
        <p className="text-xs text-zinc-500 font-mono text-center">
          By submitting this form, you agree to our privacy policy and consent to being contacted about your project.
        </p>
      </div>
    </form>
  );
};

export default BookingForm;