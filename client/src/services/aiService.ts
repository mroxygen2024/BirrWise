import { ChatMessage } from '@/types';
import { apiClient } from '@/services/apiClient';

export const aiService = {
  async sendMessage(message: string): Promise<ChatMessage> {
    const response = await apiClient.post<ChatMessage>('/ai/chat', { message }, true);
    return {
      ...response,
      timestamp: new Date(response.timestamp),
    };
  },
};
