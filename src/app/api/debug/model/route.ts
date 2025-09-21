import { NextResponse } from 'next/server';
import { groqClient } from '@/utils/groqClient';

export async function GET() {
  try {
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Get current model (from cache if available)
    const currentModel = groqClient.getCurrentModel();
    
    // Refresh and get the latest model
    const latestModel = await groqClient.refreshModelCache();

    return NextResponse.json({
      currentModel,
      latestModel,
      cacheRefreshed: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting model info:', error);
    return NextResponse.json(
      { error: 'Failed to get model information' },
      { status: 500 }
    );
  }
}
