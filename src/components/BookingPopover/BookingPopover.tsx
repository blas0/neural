import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFloating, autoUpdate, offset, flip, shift, hide } from '@floating-ui/react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import BookingForm from './BookingForm';
import { BookingPopoverProps, FormSubmissionResponse } from './BookingPopover.types';

const BookingPopover: React.FC<BookingPopoverProps> = ({ 
  isOpen, 
  onClose, 
  triggerElement,
  defaultTier 
}) => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: onClose,
    middleware: [
      offset(10),
      flip({ padding: 10 }),
      shift({ padding: 10 }),
      hide({ padding: 10 })
    ],
    whileElementsMounted: autoUpdate,
  });

  // Set the reference element
  useEffect(() => {
    if (triggerElement) {
      refs.setReference(triggerElement);
    }
  }, [triggerElement, refs]);

  // Handle escape key and backdrop clicks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (backdropRef.current && event.target === backdropRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const firstFocusable = popoverRef.current.querySelector(
        'input, select, textarea, button'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen, submissionStatus]);

  const handleSuccess = (response: FormSubmissionResponse) => {
    setSubmissionStatus('success');
    setStatusMessage(response.message || 'Thank you! We\'ll be in touch soon.');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
      setSubmissionStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const handleError = (error: string) => {
    setSubmissionStatus('error');
    setStatusMessage(error);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      setSubmissionStatus('idle');
      setStatusMessage('');
    }, 5000);
  };

  const handleClose = () => {
    setSubmissionStatus('idle');
    setStatusMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const popoverContent = (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="relative w-full max-w-md mx-auto"
      >
        <div
          ref={popoverRef}
          className="bg-white rounded-xl shadow-2xl border border-zinc-200 p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-popover-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 
              id="booking-popover-title"
              className="text-xl font-medium text-zinc-900 font-mono"
            >
              book consultation
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-zinc-600"
              aria-label="Close booking form"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success State */}
          {submissionStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2 font-mono">
                submission successful!
              </h3>
              <p className="text-sm text-green-700 font-mono">
                {statusMessage}
              </p>
              <div className="mt-4">
                <div className="w-full bg-green-200 rounded-full h-1">
                  <div className="bg-green-600 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-green-600 mt-2 font-mono">closing automatically...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {submissionStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-700 font-mono">
                  {statusMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {submissionStatus !== 'success' && (
            <>
              <div className="mb-6">
                <p className="text-sm text-zinc-600 font-mono">
                  Ready to get started? Fill out the form below and we'll schedule a consultation to discuss your project.
                </p>
              </div>

              <BookingForm
                defaultTier={defaultTier}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Render in portal to ensure proper z-index stacking
  return createPortal(popoverContent, document.body);
};

export default BookingPopover;