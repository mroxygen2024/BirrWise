import { Schema, model, Types } from "mongoose";

export interface UserDocument {
  _id: Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, passwordHash, ...rest } = ret;
        return { id: _id.toString(), ...rest };
      },
    },
  },
);

export const UserModel = model<UserDocument>("User", userSchema);
