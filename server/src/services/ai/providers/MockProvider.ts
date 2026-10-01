import { AIProvider, AIRequest, AIResponse } from '../types';

export class MockProvider implements AIProvider {
  id = 'mock';

  supports(): boolean {
    return true;
  }

  async generate(req: AIRequest): Promise<AIResponse> {
    let text = "This is a deterministic fallback response.";
    
    if (req.requiresStructuredOutput) {
      // Return a valid empty JSON object or dummy schema
      if (req.task === 'extract_bill') {
        text = JSON.stringify({ amount: 42000, items: [] });
      } else {
        text = JSON.stringify({ result: text });
      }
    }

    return {
      text,
      provider: this.id,
      model: 'mock-deterministic-v1'
    };
  }
}
