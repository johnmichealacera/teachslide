interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  active: boolean;
  context_window: number;
}

interface ModelsResponse {
  object: string;
  data: GroqModel[];
}

interface ModelCache {
  models: GroqModel[];
  selectedModel: string;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class GroqClient {
  private apiKey: string;
  private baseUrl: string;
  private modelsUrl: string;
  private modelCache: ModelCache | null = null;
  
  // Fallback models in order of preference (known good models)
  private fallbackModels = [
    'llama3-8b-8192',
    'llama3-70b-8192', 
    'mixtral-8x7b-32768',
    'gemma-7b-it'
  ];

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.modelsUrl = 'https://api.groq.com/openai/v1/models';
  }

  /**
   * Fetches available models from Groq API
   */
  private async fetchAvailableModels(): Promise<GroqModel[]> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    try {
      const response = await fetch(this.modelsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data: ModelsResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Failed to fetch models from Groq API:', error);
      return [];
    }
  }

  /**
   * Selects the best available free model based on preferences
   */
  private selectBestModel(models: GroqModel[]): string {
    if (!models.length) {
      return this.fallbackModels[0]; // Return first fallback if no models available
    }

    // Filter for active models only
    const activeModels = models.filter(model => model.active);
    
    // Preferred model patterns for free models (in order of preference)
    const preferredPatterns = [
      /^llama.*3.*8b.*8192$/i,     // llama3-8b-8192 variants
      /^llama.*3.*70b.*8192$/i,    // llama3-70b-8192 variants  
      /^mixtral.*8x7b.*32768$/i,   // mixtral-8x7b-32768 variants
      /^gemma.*7b.*it$/i,          // gemma-7b-it variants
      /^llama.*8b/i,               // Any llama 8b model
      /^llama.*70b/i,              // Any llama 70b model
      /^mixtral/i,                 // Any mixtral model
      /^gemma/i                    // Any gemma model
    ];

    // Try to find models matching preferred patterns
    for (const pattern of preferredPatterns) {
      const matchingModel = activeModels.find(model => pattern.test(model.id));
      if (matchingModel) {
        return matchingModel.id;
      }
    }

    // If no preferred pattern matches, return the first active model
    if (activeModels.length > 0) {
      return activeModels[0].id;
    }

    // Final fallback to hardcoded model
    return this.fallbackModels[0];
  }

  /**
   * Gets the best available model with caching
   */
  private async getBestModel(): Promise<string> {
    const now = Date.now();
    const cacheValidFor = 60 * 60 * 1000; // 1 hour in milliseconds

    // Check if we have a valid cached model
    if (this.modelCache && 
        (now - this.modelCache.timestamp) < this.modelCache.ttl) {
      return this.modelCache.selectedModel;
    }

    try {
      // Fetch fresh models from API
      const models = await this.fetchAvailableModels();
      const selectedModel = this.selectBestModel(models);

      // Update cache
      this.modelCache = {
        models,
        selectedModel,
        timestamp: now,
        ttl: cacheValidFor
      };

      console.log(`Selected model: ${selectedModel}`);
      return selectedModel;
    } catch (error) {
      console.warn('Failed to get best model, using fallback:', error);
      
      // If we have a cached model, use it even if expired
      if (this.modelCache?.selectedModel) {
        return this.modelCache.selectedModel;
      }
      
      // Final fallback
      return this.fallbackModels[0];
    }
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  async generatePresentation(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert educator who creates engaging, well-structured presentations for students. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Get the best available model dynamically
    const selectedModel = await this.getBestModel();

    const response = await this.createChatCompletion({
      model: selectedModel,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Manually refresh the model cache (useful for testing or manual updates)
   */
  public async refreshModelCache(): Promise<string> {
    this.modelCache = null; // Clear existing cache
    return await this.getBestModel();
  }

  /**
   * Get currently selected model (for debugging/monitoring)
   */
  public getCurrentModel(): string | null {
    return this.modelCache?.selectedModel || null;
  }
}

// Export a singleton instance
export const groqClient = new GroqClient(); 