'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-red-800 mb-1">
            Error Generating Presentation
          </h3>
          <p className="text-xs sm:text-sm text-red-700 mb-2 sm:mb-3">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs sm:text-sm text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 