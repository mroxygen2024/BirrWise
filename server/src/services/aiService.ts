import https from "https";
import { Types } from "mongoose";
import { AIMessageModel } from "../models/AIMessage";
import { TransactionModel } from "../models/Transaction";
import { BudgetModel } from "../models/Budget";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

const SYSTEM_PROMPT = `You are a financial assistant for a personal finance app.\n- Use the provided user data to answer.\n- Provide concise, actionable guidance.\n- Do not fabricate user data. If details are missing, ask a clarifying question.\n- Never provide legal or tax advice.`;

const IDENTITY_RESPONSE =
  "Hi! I’m Birrwise AI, your personal finance assistant. I’m here to help you understand your money, track budgets, and answer questions about your finances. Ask me anything like spending trends, budgets, or savings tips.";

function isIdentityOrGreeting(message: string) {
  const normalized = message.toLowerCase().trim();
  return (
    /^(hi|hello|hey|good\s*(morning|afternoon|evening))\b/.test(normalized) ||
    /who\s+are\s+you\b/.test(normalized) ||
    /what\s+is\s+your\s+name\b/.test(normalized) ||
    /why\s+are\s+you\s+here\b/.test(normalized) ||
    /what\s+do\s+you\s+do\b/.test(normalized) ||
    /how\s+are\s+you\b/.test(normalized)
  );
}

function buildPrompt(userMessage: string, context: string) {
  return {
    system: SYSTEM_PROMPT,
    user: `${context}\n\nUser question: ${userMessage}`,
  };
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

async function buildUserContext(userId: string) {
  const now = new Date();
  const monthKey = now.toISOString().slice(0, 7);
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const userObjectId = new Types.ObjectId(userId);

  const [incomeAgg, expenseAgg, expenseByCategory, budgets, recentTransactions] = await Promise.all([
    TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "income", date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 3 },
    ]),
    BudgetModel.find({ userId: userObjectId, month: monthKey }).lean(),
    TransactionModel.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
  ]);

  const totalIncome = incomeAgg[0]?.total || 0;
  const totalExpenses = expenseAgg[0]?.total || 0;
  const daysElapsed = Math.max(1, now.getUTCDate());
  const avgDailyIncome = totalIncome / daysElapsed;
  const avgDailyExpenses = totalExpenses / daysElapsed;

  const spentMap = new Map<string, number>(expenseByCategory.map((item) => [item._id, item.total]));

  const budgetLines = budgets.length
    ? budgets.map((b) => {
        const spent = spentMap.get(b.category) || 0;
        return `- ${b.category}: spent ${formatAmount(spent)} of ${formatAmount(b.limit)}`;
      })
    : ["- No budgets found for this month."];

  const recentLines = recentTransactions.length
    ? recentTransactions.map((t) => {
        const dateLabel = new Date(t.date).toISOString().slice(0, 10);
        const sign = t.type === "expense" ? "-" : "+";
        return `- ${dateLabel}: ${t.description} (${t.category}) ${sign}${formatAmount(t.amount)}`;
      })
    : ["- No recent transactions found."];

  const topCategories = expenseByCategory.length
    ? expenseByCategory.map((item) => `${item._id}: ${formatAmount(item.total)}`).join(", ")
    : "No expense categories recorded this month.";

  return [
    `User data context (month ${monthKey}):`,
    `- Total income: ${formatAmount(totalIncome)}`,
    `- Total expenses: ${formatAmount(totalExpenses)}`,
    `- Avg daily income (month-to-date): ${formatAmount(avgDailyIncome)}`,
    `- Avg daily spending (month-to-date): ${formatAmount(avgDailyExpenses)}`,
    `- Top spending categories: ${topCategories}`,
    `Budgets:`,
    ...budgetLines,
    `Recent transactions:`,
    ...recentLines,
  ].join("\n");
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

    let assistantContent: string;
    if (isIdentityOrGreeting(message)) {
      assistantContent = IDENTITY_RESPONSE;
    } else {
      const context = await buildUserContext(userId);
      const prompt = buildPrompt(message, context);
      assistantContent = await callGemini(prompt);
    }

    const assistantMessage = await AIMessageModel.create({
      userId,
      role: "assistant",
      content: assistantContent,
      timestamp: new Date(),
    });

    return { userMessage: userMessage.toJSON(), assistantMessage: assistantMessage.toJSON() };
  },
};
