import { AIMessageModel } from "../models/AIMessage";

function generateStubResponse(): string {
  const responses = [
    "Based on your recent spending, consider setting aside a fixed amount each week to smooth out expenses.",
    "Your expense pattern suggests you could increase savings by reducing discretionary categories slightly.",
    "You are on track with your budgets. Consider reviewing subscriptions for potential savings.",
    "A simple way to boost savings is to automate transfers to a savings account on payday.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export const aiService = {
  async chat(userId: string, message: string) {
    const now = new Date();

    const userMessage = await AIMessageModel.create({
      userId,
      role: "user",
      content: message,
      timestamp: now,
    });

    const assistantMessage = await AIMessageModel.create({
      userId,
      role: "assistant",
      content: generateStubResponse(),
      timestamp: new Date(),
    });

    return { userMessage: userMessage.toJSON(), assistantMessage: assistantMessage.toJSON() };
  },
};
