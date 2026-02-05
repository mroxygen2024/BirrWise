import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";

const router = Router();

router.get("/summary", dashboardController.summary);
router.get("/category-expenses", dashboardController.categoryExpenses);
router.get("/monthly", dashboardController.monthly);
router.get("/daily-expenses", dashboardController.dailyExpenses);

export default router;
