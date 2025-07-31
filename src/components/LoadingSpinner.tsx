'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-6 h-6 sm:w-8 sm:h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mb-3 sm:mb-4`}></div>
      <p className="text-gray-600 text-xs sm:text-sm">{message}</p>
    </div>
  );
} 