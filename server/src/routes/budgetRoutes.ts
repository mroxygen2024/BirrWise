import { Router } from "express";
import { budgetController } from "../controllers/budgetController";
import { validateRequest } from "../middleware/validateRequest";
import { getBudgetsSchema, updateBudgetSchema } from "../schemas/budgetSchemas";

const router = Router();

router.get("/", validateRequest(getBudgetsSchema), budgetController.list);
router.put("/:id", validateRequest(updateBudgetSchema), budgetController.update);

export default router;
