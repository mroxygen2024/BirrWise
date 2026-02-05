import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { aiService } from "../services/aiService";

export const aiController = {
  async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const result = await aiService.chat(req.userId as string, message);
      return res.status(200).json(result.assistantMessage);
    } catch (err) {
      return next(err as Error);
    }
  },
};
