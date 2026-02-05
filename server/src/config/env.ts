import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtIssuer: process.env.JWT_ISSUER || "savvy-finance-hub",
  jwtAudience: process.env.JWT_AUDIENCE || "savvy-finance-hub-client",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
