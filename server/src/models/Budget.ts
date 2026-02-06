import { Schema, model, Types } from "mongoose";

export interface BudgetDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  category: string;
  limit: number;
  spent: number;
  month: string; // YYYY-MM
}

const budgetSchema = new Schema<BudgetDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true },
    spent: { type: Number, required: true, default: 0 },
    month: { type: String, required: true },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, ...rest } = ret;
        return { id: _id.toString(), ...rest };
      },
    },
  },
);

export const BudgetModel = model<BudgetDocument>("Budget", budgetSchema);
