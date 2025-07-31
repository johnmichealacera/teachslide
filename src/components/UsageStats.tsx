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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Your Impact</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.presentationsGenerated}
          </div>
          <div className="text-sm text-gray-600">Presentations Created</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(stats.totalTimeSaved)}
          </div>
          <div className="text-sm text-gray-600">Time Saved</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.floor(stats.totalTimeSaved / 60)}
          </div>
          <div className="text-sm text-gray-600">Students Impacted</div>
        </div>
      </div>
      
      {stats.lastGenerated && (
        <div className="text-center mt-4 text-sm text-gray-500">
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