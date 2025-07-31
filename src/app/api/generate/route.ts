import { NextRequest, NextResponse } from 'next/server';
import { groqClient } from '@/utils/groqClient';

export async function POST(request: NextRequest) {
  try {
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const { topic, classLevel, duration, teachingGoals } = await request.json();

    if (!topic || !classLevel || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, classLevel, duration' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert educator creating a presentation for ${classLevel} students on "${topic}". 
    
Class Duration: ${duration} minutes
Teaching Goals: ${teachingGoals || 'General understanding of the topic'}

Please create a comprehensive presentation with the following structure:

1. SLIDE OUTLINE (4-6 slides):
   - Introduction slide
   - Key concepts (2-3 slides)
   - Examples/Applications
   - Summary/Recap

2. TALKING POINTS for each slide (2-3 bullet points per slide)

3. QUIZ (3-5 multiple choice questions with answers)

Format your response as JSON with this exact structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Point 1", "Point 2", "Point 3"],
      "talkingPoints": ["Talking point 1", "Talking point 2"]
    }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Make the content engaging, age-appropriate, and suitable for the specified duration.`;

    const response = await groqClient.generatePresentation(prompt);
    
    if (!response) {
      throw new Error('No response from Groq');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from Groq');
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    );
  }
} 