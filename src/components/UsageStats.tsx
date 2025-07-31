'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, BookOpen } from 'lucide-react';

interface UsageStatsProps {
  isVisible?: boolean;
}

export default function UsageStats({ isVisible = false }: UsageStatsProps) {
  const [stats, setStats] = useState({
    presentationsGenerated: 0,
    totalTimeSaved: 0,
    lastGenerated: null as string | null
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('presentation-generator-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);



  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center mb-3 sm:mb-4">
        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Impact</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:flex-col sm:text-center">
          <div className="flex items-center sm:justify-center">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-0 sm:mb-2" />
            <span className="text-sm sm:text-xs sm:text-gray-600 sm:hidden">Presentations Created:</span>
          </div>
          <div className="flex items-center sm:flex-col">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mr-2 sm:mr-0">
              {stats.presentationsGenerated}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">Presentations Created</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:flex-col sm:text-center">
          <div className="flex items-center sm:justify-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-0 sm:mb-2" />
            <span className="text-sm sm:text-xs sm:text-gray-600 sm:hidden">Time Saved:</span>
          </div>
          <div className="flex items-center sm:flex-col">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mr-2 sm:mr-0">
              {formatTime(stats.totalTimeSaved)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">Time Saved</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:flex-col sm:text-center">
          <div className="flex items-center sm:justify-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-0 sm:mb-2" />
            <span className="text-sm sm:text-xs sm:text-gray-600 sm:hidden">Students Impacted:</span>
          </div>
          <div className="flex items-center sm:flex-col">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mr-2 sm:mr-0">
              {Math.floor(stats.totalTimeSaved / 60)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">Students Impacted</div>
          </div>
        </div>
      </div>
      
      {stats.lastGenerated && (
        <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
          Last presentation: {new Date(stats.lastGenerated).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

// Export the update function for use in other components
export const updateUsageStats = () => {
  const savedStats = localStorage.getItem('presentation-generator-stats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    const newStats = {
      presentationsGenerated: stats.presentationsGenerated + 1,
      totalTimeSaved: stats.totalTimeSaved + 120,
      lastGenerated: new Date().toISOString()
    };
    localStorage.setItem('presentation-generator-stats', JSON.stringify(newStats));
  } else {
    const newStats = {
      presentationsGenerated: 1,
      totalTimeSaved: 120,
      lastGenerated: new Date().toISOString()
    };
    localStorage.setItem('presentation-generator-stats', JSON.stringify(newStats));
  }
}; 