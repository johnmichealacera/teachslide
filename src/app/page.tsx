'use client';

import { useState } from 'react';
import { PresentationRequest, Presentation } from '@/types/presentation';
import PresentationForm from '@/components/PresentationForm';
import PresentationDisplay from '@/components/PresentationDisplay';
import ErrorMessage from '@/components/ErrorMessage';
import GenerationProgress from '@/components/GenerationProgress';
import UsageStats, { updateUsageStats } from '@/components/UsageStats';
import { Toaster, toast } from 'react-hot-toast';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePresentation = async (data: PresentationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate presentation');
      }

      setPresentation(result);
      updateUsageStats(); // Update usage statistics
      toast.success('Presentation generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate presentation. Please try again.';
      setError(errorMessage);
      toast.error('Failed to generate presentation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPresentation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Presentation Generator
              </h1>
            </div>
            {presentation && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Generate New Presentation
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <GenerationProgress isGenerating={isLoading} />
        ) : !presentation ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Generate Ready-Made Class Presentations
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Create engaging slide decks, talking points, and quizzes in under 2 minutes. 
                Perfect for educators who want to focus on teaching, not prep work.
              </p>
            </div>

            {/* Usage Stats */}
            <UsageStats isVisible={true} />

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Generation</h3>
                <p className="text-gray-600 text-sm">Get complete presentations in under 2 minutes</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete Package</h3>
                <p className="text-gray-600 text-sm">Slides, talking points, and quizzes included</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Age-Appropriate</h3>
                <p className="text-gray-600 text-sm">Tailored for different class levels</p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6">
                <ErrorMessage 
                  message={error} 
                  onRetry={() => handleGeneratePresentation({
                    topic: '',
                    classLevel: '1st Year College',
                    duration: 60,
                    teachingGoals: ''
                  })}
                />
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <PresentationForm onSubmit={handleGeneratePresentation} isLoading={isLoading} />
            </div>

            {/* Footer Note */}
            <div className="text-center mt-8 text-gray-500 text-sm">
              <p>No account required • Your data is not stored • Powered by AI</p>
            </div>
          </div>
        ) : (
          <PresentationDisplay presentation={presentation} />
        )}
      </main>
    </div>
  );
}
