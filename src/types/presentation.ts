export interface Slide {
  title: string;
  content: string[];
  talkingPoints: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
  quiz: QuizQuestion[];
}

export interface PresentationRequest {
  topic: string;
  classLevel: string;
  duration: number;
  teachingGoals?: string;
} 