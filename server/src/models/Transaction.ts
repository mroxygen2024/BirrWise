import { Schema, model, Types } from "mongoose";

export interface TransactionDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  createdAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 100 },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const TransactionModel = model<TransactionDocument>("Transaction", transactionSchema);
