import https from "https";
import { AIMessageModel } from "../models/AIMessage";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

const SYSTEM_PROMPT = `You are a financial assistant for a personal finance app.\n- Provide concise, actionable guidance.\n- Do not fabricate user data. If details are missing, ask a clarifying question.\n- Never provide legal or tax advice.`;

function buildPrompt(userMessage: string) {
  return {
    system: SYSTEM_PROMPT,
    user: userMessage,
  };
}

async function callGemini(prompt: { system: string; user: string }): Promise<string> {
  if (!env.aiEnabled) {
    throw new ApiError(503, "AI is disabled");
  }

  if (!env.googleApiKey) {
    throw new ApiError(503, "AI is not configured");
  }

  const payload = JSON.stringify({
    systemInstruction: {
      role: "system",
      parts: [{ text: prompt.system }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt.user }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
    },
  });

  return new Promise((resolve, reject) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.googleApiKey}`;
    const request = https.request(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          const status = response.statusCode || 0;
          if (status === 429) {
            return reject(new ApiError(429, "AI rate limit exceeded"));
          }
          if (status < 200 || status >= 300) {
            let message = "AI provider error";
            try {
              const parsed = JSON.parse(body);
              message = parsed?.error?.message || message;
            } catch {
              // Ignore parse errors
            }
            return reject(new ApiError(status || 502, message));
          }

          try {
            const parsed = JSON.parse(body);
            const content = parsed?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join(" ").trim();
            if (!content) {
              return reject(new ApiError(502, "AI provider returned empty response"));
            }
            return resolve(content);
          } catch {
            return reject(new ApiError(502, "Failed to parse AI response"));
          }
        });
      },
    );

    request.on("error", () => {
      reject(new ApiError(502, "AI provider request failed"));
    });

    request.write(payload);
    request.end();
  });
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

    const prompt = buildPrompt(message);
    const assistantContent = await callGemini(prompt);

    const assistantMessage = await AIMessageModel.create({
      userId,
      role: "assistant",
      content: assistantContent,
      timestamp: new Date(),
    });

    return { userMessage: userMessage.toJSON(), assistantMessage: assistantMessage.toJSON() };
  },
};
