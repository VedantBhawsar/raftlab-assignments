import mongoose, { Document, Schema } from "mongoose";

import { hashPassword, validatePassword } from "../utils/bcrypt";
import { IUser } from "../interfaces";

interface IUserDocument extends Document {
  firstName: string;
  username: string;
  email: string;
  password: string;
  lastName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return validatePassword(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
