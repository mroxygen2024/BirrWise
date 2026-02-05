import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(400, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

    return { user: user.toJSON(), accessToken: token };
  },

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

    return { user: user.toJSON(), accessToken: token };
  },

  async me(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return { user: user.toJSON() };
  },

  async logout() {
    return { success: true };
  },
};
