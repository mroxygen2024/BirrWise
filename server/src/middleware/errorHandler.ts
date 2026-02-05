import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  return res.status(500).json({ message: "Internal server error" });
}
