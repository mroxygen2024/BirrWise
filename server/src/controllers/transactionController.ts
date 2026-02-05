import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { transactionService } from "../services/transactionService";

export const transactionController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.list(req.userId as string);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.create(req.userId as string, req.body);
      return res.status(201).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.update(req.userId as string, req.params.id, req.body);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.remove(req.userId as string, req.params.id);
      return res.status(200).json(data);
    } catch (err) {
      return next(err as Error);
    }
  },
};
