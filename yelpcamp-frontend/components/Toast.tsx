'use client';

import { useToastStore } from '@/lib/store';
import { useEffect } from 'react';
import clsx from 'clsx';

export default function Toast() {
  const { message, type, show, hideToast } = useToastStore();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, hideToast]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div
        className={clsx(
          'px-6 py-4 rounded-lg flex items-center space-x-3 min-w-[300px] glass-strong shadow-lg',
          {
            'text-success border-success/30': type === 'success',
            'text-error border-error/30': type === 'error',
          }
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="flex-1">{message}</p>

        {/* Close Button */}
        <button
          onClick={hideToast}
          className="flex-shrink-0 hover:opacity-80 transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
