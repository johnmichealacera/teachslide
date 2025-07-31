'use client';

import { useState } from 'react';
import { Presentation } from '@/types/presentation';
import { Download, CheckCircle, XCircle } from 'lucide-react';

interface PresentationDisplayProps {
  presentation: Presentation;
}

export default function PresentationDisplay({ presentation }: PresentationDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    let correct = 0;
    presentation.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: presentation.quiz.length };
  };

  const exportToText = () => {
    let content = `${presentation.title}\n\n`;
    
    presentation.slides.forEach((slide, index) => {
      content += `Slide ${index + 1}: ${slide.title}\n`;
      content += `Content:\n`;
      slide.content.forEach(point => {
        content += `• ${point}\n`;
      });
      content += `\nTalking Points:\n`;
      slide.talkingPoints.forEach(point => {
        content += `• ${point}\n`;
      });
      content += '\n';
    });

    content += `\nQUIZ\n`;
    presentation.quiz.forEach((question, index) => {
      content += `${index + 1}. ${question.question}\n`;
      question.options.forEach((option, optIndex) => {
        const letter = String.fromCharCode(65 + optIndex);
        content += `   ${letter}. ${option}\n`;
      });
      content += `   Correct Answer: ${question.correctAnswer}\n`;
      content += `   Explanation: ${question.explanation}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{presentation.title}</h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={exportToText}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as Text
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowQuiz(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !showQuiz ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Slides ({presentation.slides.length})
        </button>
        <button
          onClick={() => setShowQuiz(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showQuiz ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Quiz ({presentation.quiz.length} questions)
        </button>
      </div>

      {!showQuiz ? (
        /* Slides Display */
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Slide Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Slide {currentSlide + 1} of {presentation.slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide(Math.min(presentation.slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === presentation.slides.length - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Current Slide */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {presentation.slides[currentSlide].title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Content</h3>
                <ul className="space-y-3">
                  {presentation.slides[currentSlide].content.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talking Points */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Talking Points</h3>
                <ul className="space-y-3">
                  {presentation.slides[currentSlide].talkingPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="flex justify-center space-x-2">
            {presentation.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Quiz Display */
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!showQuizResults ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h2>
              <div className="space-y-8">
                {presentation.quiz.map((question, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const letter = String.fromCharCode(65 + optIndex);
                        return (
                          <label key={optIndex} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={letter}
                              onChange={(e) => setQuizAnswers({ ...quizAnswers, [index]: e.target.value })}
                              className="mr-3"
                            />
                            <span className="text-gray-700">
                              {letter}. {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleQuizSubmit}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h2>
              {(() => {
                const score = getQuizScore();
                return (
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {score.correct}/{score.total}
                    </div>
                    <div className="text-lg text-gray-600">
                      {score.correct === score.total ? 'Perfect!' : 
                       score.correct >= score.total * 0.8 ? 'Great job!' :
                       score.correct >= score.total * 0.6 ? 'Good effort!' : 'Keep studying!'}
                    </div>
                  </div>
                );
              })()}
              
              <div className="space-y-6">
                {presentation.quiz.map((question, index) => {
                  const userAnswer = quizAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          Question {index + 1}
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-3">{question.question}</p>
                      <div className="text-sm text-gray-600">
                        <p><strong>Your answer:</strong> {userAnswer || 'Not answered'}</p>
                        <p><strong>Correct answer:</strong> {question.correctAnswer}</p>
                        <p className="mt-2"><strong>Explanation:</strong> {question.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 