import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { validateRequest } from "../middleware/validateRequest";
import { aiChatSchema } from "../schemas/aiSchemas";

const router = Router();

router.post("/chat", validateRequest(aiChatSchema), aiController.chat);

export default router;
