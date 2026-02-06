import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserModel } from "../models/User";
import { RefreshTokenModel } from "../models/RefreshToken";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

type TokenPayload = { userId: string };

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function parseExpiresInToMs(expiresIn: string) {
  const trimmed = expiresIn.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed) * 1000;
  }

  const match = /^(\d+)([smhd])$/.exec(trimmed);
  if (!match) {
    return 0;
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 0);
}

function generateAccessToken(payload: TokenPayload) {
  const options: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

async function generateRefreshToken(userId: string) {
  const tokenId = crypto.randomUUID();
  const options: jwt.SignOptions = {
    expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
    jwtid: tokenId,
  };
  const refreshToken = jwt.sign({ userId }, env.refreshTokenSecret, options);

  const expiresAt = new Date(Date.now() + parseExpiresInToMs(env.refreshTokenExpiresIn));
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId: new Types.ObjectId(userId),
    tokenId,
    tokenHash,
    expiresAt,
  });

  return { refreshToken, refreshExpiresAt: expiresAt };
}

async function issueTokens(userId: string) {
  const accessToken = generateAccessToken({ userId });
  const { refreshToken, refreshExpiresAt } = await generateRefreshToken(userId);
  return { accessToken, refreshToken, refreshExpiresAt };
}

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

    const tokens = await issueTokens(user._id.toString());
    return { user: user.toJSON(), ...tokens };
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

    const tokens = await issueTokens(user._id.toString());
    return { user: user.toJSON(), ...tokens };
  },

  async refresh(refreshToken: string) {
    let payload: (TokenPayload & { jti?: string }) | null = null;

    try {
      payload = jwt.verify(refreshToken, env.refreshTokenSecret, {
        issuer: env.jwtIssuer,
        audience: env.jwtAudience,
      }) as TokenPayload & { jti?: string };
    } catch {
      throw new ApiError(401, "Unauthenticated");
    }

    const tokenId = payload.jti;
    if (!tokenId) {
      throw new ApiError(401, "Unauthenticated");
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await RefreshTokenModel.findOne({ tokenId, tokenHash, revokedAt: null });
    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw new ApiError(401, "Unauthenticated");
    }

    await RefreshTokenModel.updateOne({ _id: storedToken._id }, { revokedAt: new Date() });

    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, "Unauthenticated");
    }

    const tokens = await issueTokens(user._id.toString());
    return { user: user.toJSON(), ...tokens };
  },

  async me(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return { user: user.toJSON() };
  },

  async logout(refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await RefreshTokenModel.updateOne(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date() },
      );
    }
    return { success: true };
  },
};
