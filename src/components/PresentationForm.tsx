'use client';

import { useState } from 'react';
import { BookOpen, Clock, Target, Lightbulb } from 'lucide-react';
import { PresentationRequest } from '@/types/presentation';

interface PresentationFormProps {
  onSubmit: (data: PresentationRequest) => void;
  isLoading: boolean;
}

export default function PresentationForm({ onSubmit, isLoading }: PresentationFormProps) {
  const [formData, setFormData] = useState<PresentationRequest>({
    topic: '',
    classLevel: '1st Year College',
    duration: 60,
    teachingGoals: ''
  });

  const classLevels = [
    '1st Year College',
    '2nd Year College', 
    '3rd Year College',
    '4th Year College',
    'High School',
    'Middle School'
  ];

  const durations = [30, 45, 60, 90, 120];

  const exampleTopics = [
    'Introduction to Programming',
    'Educational Psychology',
    'Digital Literacy',
    'Classroom Management',
    'Learning Theories',
    'Technology in Education',
    'Student Assessment',
    'Curriculum Design'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          <BookOpen className="inline w-4 h-4 mr-2" />
          What topic will you be teaching?
        </label>
        <input
          type="text"
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., Introduction to Programming, Educational Psychology, Digital Literacy"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-2">Example topics:</p>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setFormData({ ...formData, topic })}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class Level */}
      <div>
        <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="inline w-4 h-4 mr-2" />
          Target Class Level
        </label>
        <select
          id="classLevel"
          value={formData.classLevel}
          onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {classLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline w-4 h-4 mr-2" />
          Class Duration (minutes)
        </label>
        <select
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {durations.map((duration) => (
            <option key={duration} value={duration}>
              {duration} minutes
            </option>
          ))}
        </select>
      </div>

      {/* Teaching Goals */}
      <div>
        <label htmlFor="teachingGoals" className="block text-sm font-medium text-gray-700 mb-2">
          <Lightbulb className="inline w-4 h-4 mr-2" />
          Teaching Goals (Optional)
        </label>
        <textarea
          id="teachingGoals"
          value={formData.teachingGoals}
          onChange={(e) => setFormData({ ...formData, teachingGoals: e.target.value })}
          placeholder="What should students learn or understand by the end of this class?"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.topic.trim()}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Generating Presentation...
          </div>
        ) : (
          'Generate Presentation'
        )}
      </button>
    </form>
  );
} 