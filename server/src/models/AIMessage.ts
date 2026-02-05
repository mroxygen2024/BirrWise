import { Schema, model, Types } from "mongoose";

export interface AIMessageDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const aiMessageSchema = new Schema<AIMessageDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: false,
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

export const AIMessageModel = model<AIMessageDocument>("AIMessage", aiMessageSchema);
