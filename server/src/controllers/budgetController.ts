import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { budgetService } from "../services/budgetService";

export const budgetController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
      const data = await budgetService.list(req.userId as string, month);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await budgetService.update(req.userId as string, req.params.id, req.body.limit);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },
};
