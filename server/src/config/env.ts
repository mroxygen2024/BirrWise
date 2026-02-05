import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is required");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
