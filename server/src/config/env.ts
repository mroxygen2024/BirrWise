import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtIssuer: process.env.JWT_ISSUER || "savvy-finance-hub",
  jwtAudience: process.env.JWT_AUDIENCE || "savvy-finance-hub-client",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080",
  aiEnabled: process.env.AI_ENABLED === "true",
  googleApiKey: process.env.GOOGLE_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};
export const corsOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is required");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

if (!env.refreshTokenSecret) {
  throw new Error("REFRESH_TOKEN_SECRET is required");
}

if (env.aiEnabled && !env.googleApiKey) {
  throw new Error("GOOGLE_API_KEY is required when AI_ENABLED=true");
}
