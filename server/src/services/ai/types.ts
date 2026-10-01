export type AIModelClass = 'FAST' | 'BALANCED' | 'REASONING' | 'VISION' | 'EMBEDDING';

export interface AIRequest {
  task: string;
  prompt: string;
  modelClass: AIModelClass;
  requiresStructuredOutput?: boolean;
  systemInstruction?: string;
  forceMock?: boolean;
}

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIProvider {
  id: string;
  generate(req: AIRequest, apiKey?: string): Promise<AIResponse>;
  supports(modelClass: AIModelClass): boolean;
}
