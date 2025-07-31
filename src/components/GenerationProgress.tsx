'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle } from 'lucide-react';

interface GenerationProgressProps {
  isGenerating: boolean;
}

export default function GenerationProgress({ isGenerating }: GenerationProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing your topic and requirements...',
    'Creating slide structure and content...',
    'Generating talking points and examples...',
    'Creating quiz questions...',
    'Finalizing your presentation...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating) {
      setElapsedTime(0);
      setCurrentStep(0);
      
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      // Simulate step progression
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 8000); // Change step every 8 seconds

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
      };
    }
  }, [isGenerating, steps.length]);

  if (!isGenerating) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Generating Your Presentation
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          This usually takes 30-60 seconds
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 sm:space-x-3 p-3 rounded-lg transition-colors ${
              index <= currentStep 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-blue-500 text-white animate-pulse' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span className={`text-xs sm:text-sm ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-xs sm:text-sm">
          Time elapsed: {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  );
} 