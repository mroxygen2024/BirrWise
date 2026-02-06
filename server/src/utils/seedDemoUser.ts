import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { UserModel } from "../models/User";
import { TransactionModel } from "../models/Transaction";
import { BudgetModel } from "../models/Budget";
import { AIMessageModel } from "../models/AIMessage";

const DEMO_EMAIL = "Fuad@example.com";
const DEMO_PASSWORD = "Fuad123";
const DEMO_NAME = "Fuad S.";

function startOfMonth(date: Date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addDays(date: Date, days: number) {
	const d = new Date(date.getTime());
	d.setUTCDate(d.getUTCDate() + days);
	return d;
}

async function seed() {
	await mongoose.connect(env.mongoUri);

	const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

	const user = await UserModel.findOneAndUpdate(
		{ email: DEMO_EMAIL },
		{ email: DEMO_EMAIL, name: DEMO_NAME, passwordHash },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);

	const userId = user._id;

	await Promise.all([
		TransactionModel.deleteMany({ userId }),
		BudgetModel.deleteMany({ userId }),
		AIMessageModel.deleteMany({ userId }),
	]);

	const now = new Date();
	const monthKey = now.toISOString().slice(0, 7);
	const monthStart = startOfMonth(now);

	await BudgetModel.insertMany([
		{ userId, category: "Food & Dining", limit: 500, spent: 0, month: monthKey },
		{ userId, category: "Transportation", limit: 200, spent: 0, month: monthKey },
		{ userId, category: "Entertainment", limit: 150, spent: 0, month: monthKey },
		{ userId, category: "Shopping", limit: 300, spent: 0, month: monthKey },
		{ userId, category: "Bills & Utilities", limit: 400, spent: 0, month: monthKey },
	]);

	await TransactionModel.insertMany([
		{
			userId,
			description: "Monthly Salary",
			amount: 10000,
			type: "income",
			category: "Salary",
			date: addDays(monthStart, 1),
		},
		{
			userId,
			description: "Freelance Project",
			amount: 1600,
			type: "income",
			category: "Freelance",
			date: addDays(monthStart, 8),
		},
		{
			userId,
			description: "Grocery Shopping",
			amount: 150,
			type: "expense",
			category: "Food & Dining",
			date: addDays(monthStart, 2),
		},
		{
			userId,
			description: "Restaurant Dinner",
			amount: 85,
			type: "expense",
			category: "Food & Dining",
			date: addDays(monthStart, 4),
		},
		{
			userId,
			description: "Taxi",
			amount: 45,
			type: "expense",
			category: "Transportation",
			date: addDays(monthStart, 5),
		},
		{
			userId,
			description: "Copilot Subscription",
			amount: 15,
			type: "expense",
			category: "Entertainment",
			date: addDays(monthStart, 6),
		},
		{
			userId,
			description: "Electric Bill",
			amount: 120,
			type: "expense",
			category: "Bills & Utilities",
			date: addDays(monthStart, 7),
		},
		{
			userId,
			description: "New Shoes",
			amount: 3500,
			type: "expense",
			category: "Shopping",
			date: addDays(monthStart, 9),
		},
	]);

	await AIMessageModel.insertMany([
		{
			userId,
			role: "user",
			content: "How am I doing this month?",
			timestamp: new Date(),
		},
		{
			userId,
			role: "assistant",
			content: "I can summarize your income, spending, and budget usage for this month. Ask about a specific category or goal.",
			timestamp: new Date(),
		},
	]);

	console.log("Seed complete.");
	console.log(`Demo user: ${DEMO_EMAIL}`);
	console.log(`Demo password: ${DEMO_PASSWORD}`);
}

seed()
	.catch((err) => {
		console.error("Seed failed", err);
		process.exit(1);
	})
	.finally(async () => {
		await mongoose.disconnect();
	});
