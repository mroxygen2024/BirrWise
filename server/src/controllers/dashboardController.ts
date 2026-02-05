import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { dashboardService } from "../services/dashboardService";

export const dashboardController = {
  async summary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.summary(req.userId as string);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async categoryExpenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.categoryExpenses(req.userId as string);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async monthly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.monthly(req.userId as string);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async dailyExpenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.dailyExpenses(req.userId as string);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },
};
