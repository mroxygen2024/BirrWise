import express from "express";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import aiRoutes from "./routes/aiRoutes";
import { requireAuth } from "./middleware/auth";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", requireAuth, transactionRoutes);
app.use("/api/budgets", requireAuth, budgetRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/ai", requireAuth, aiRoutes);

app.use(notFound);
app.use(errorHandler);
