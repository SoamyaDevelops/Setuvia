import { AIRequest, AIResponse } from './types';
import { GeminiProvider } from './providers/GeminiProvider';
import { MockProvider } from './providers/MockProvider';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  private static gemini = new GeminiProvider();
  private static mock = new MockProvider();

  static async run(req: AIRequest): Promise<AIResponse> {
    if (req.forceMock || process.env.AI_MODE === 'mock') {
      return this.mock.generate(req);
    }

    const keys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY
    ].filter(Boolean) as string[];
    
    if (keys.length === 0) {
      console.warn('[AIService] No GEMINI_API_KEY configured, falling back to MockProvider');
      return this.mock.generate(req);
    }

    // Try keys with load-balancing and retry on secondary key
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);

    for (const key of shuffledKeys) {
      try {
        const response = await this.gemini.generate(req, key);
        return response;
      } catch (error) {
        console.warn(`[AIService] Key ${key.slice(0, 10)}... failed, trying next key...`);
      }
    }

    console.error('[AIService] All Gemini API keys failed, falling back to mock provider');
    return this.mock.generate(req);
  }
}
