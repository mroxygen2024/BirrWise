import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.errors[0]?.message || "Invalid request";
      return next(new ApiError(400, message));
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    return next();
  };
}
