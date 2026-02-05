import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { AuthRequest } from "../middleware/auth";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (err) {
      return next(err as Error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      return res.status(201).json(result);
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

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.logout();
      return res.status(200).json(result);
    } catch (err) {
      return next(err as Error);
    }
  },
};
