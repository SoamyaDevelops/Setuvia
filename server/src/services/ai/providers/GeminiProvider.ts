import { AIProvider, AIRequest, AIResponse } from '../types';

export class GeminiProvider implements AIProvider {
  id = 'gemini';

  supports(modelClass: 'FAST' | 'BALANCED' | 'REASONING' | 'VISION' | 'EMBEDDING'): boolean {
    return true;
  }

  async generate(req: AIRequest, apiKey?: string): Promise<AIResponse> {
    if (!apiKey) throw new Error('API key is required for GeminiProvider');
    
    // Supported models in priority order for ultra-fast response
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ];

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        const body: any = {
          contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
        };

        if (req.systemInstruction) {
          body.systemInstruction = { parts: [{ text: req.systemInstruction }] };
        }
        
        if (req.requiresStructuredOutput) {
          body.generationConfig.responseMimeType = 'application/json';
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gemini API Error (${modelName}): ${res.status} ${errorText}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        return {
          text,
          provider: this.id,
          model: modelName,
          usage: {
            promptTokens: data.usageMetadata?.promptTokenCount || 0,
            completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          }
        };
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiProvider] ${modelName} failed, trying next candidate model...`, err);
      }
    }

    throw lastError || new Error('All Gemini candidate models failed');
  }
}
