import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, registerSchema } from "../schemas/authSchemas";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
