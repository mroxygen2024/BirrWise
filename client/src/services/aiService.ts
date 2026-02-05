import { ChatMessage } from '@/types';
import { mockAIResponses } from './mockData';
import { delay, generateId } from '@/utils/formatters';

// Simple mock AI that returns random responses
export const aiService = {
  async sendMessage(message: string): Promise<ChatMessage> {
    // Simulate thinking time
    await delay(1000 + Math.random() * 1000);
    
    // Pick a random response
    const responseText = mockAIResponses[
      Math.floor(Math.random() * mockAIResponses.length)
    ];
    
    return {
      id: generateId(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };
  },
};
