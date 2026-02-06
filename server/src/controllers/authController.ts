import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { AuthRequest } from "../middleware/auth";
import { env } from "../config/env";

function getCookie(req: Request, name: string) {
  const header = req.headers.cookie;
  if (!header) return null;

  const parts = header.split(";").map((part) => part.trim());
  const entry = parts.find((part) => part.startsWith(`${name}=`));
  if (!entry) return null;

  return decodeURIComponent(entry.substring(name.length + 1));
}

function setRefreshCookie(res: Response, token: string, expiresAt: Date) {
  const maxAge = Math.max(0, expiresAt.getTime() - Date.now());
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/api/auth",
  });
}

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
      return res.status(200).json({ user: result.user, accessToken: result.accessToken });
    } catch (err) {
      return next(err as Error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
      return res.status(201).json({ user: result.user, accessToken: result.accessToken });
    } catch (err) {
      return next(err as Error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getCookie(req, "refreshToken");
      if (!token) {
        return res.status(401).json({ message: "Unauthenticated" });
      }
      const result = await authService.refresh(token);
      setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
      return res.status(200).json({ user: result.user, accessToken: result.accessToken });
    } catch (err) {
      return next(err as Error);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.me(req.userId as string);
      return res.status(200).json(result);
    } catch (err) {
      return next(err as Error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getCookie(req, "refreshToken");
      const result = await authService.logout(token || undefined);
      clearRefreshCookie(res);
      return res.status(200).json(result);
    } catch (err) {
      return next(err as Error);
    }
  },
};
