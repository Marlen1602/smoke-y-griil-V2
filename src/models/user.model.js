import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9]+$/,
    },
    nombre: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    apellidos: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["cliente", "administrador"],
      default: "cliente",
    },
    verificationCode: { type: String },
    resetPasswordToken: { type: String },
    isVerified: { type: Boolean, default: false },
    isVeriedForResetPassword: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
