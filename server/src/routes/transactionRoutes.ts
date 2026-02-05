import { Router } from "express";
import { transactionController } from "../controllers/transactionController";
import { validateRequest } from "../middleware/validateRequest";
import { createTransactionSchema, updateTransactionSchema, deleteTransactionSchema } from "../schemas/transactionSchemas";

const router = Router();

router.get("/", transactionController.list);
router.post("/", validateRequest(createTransactionSchema), transactionController.create);
router.put("/:id", validateRequest(updateTransactionSchema), transactionController.update);
router.delete("/:id", validateRequest(deleteTransactionSchema), transactionController.remove);

export default router;
