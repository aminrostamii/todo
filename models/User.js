import { Schema, model, models } from "mongoose";

// Todo Schema
const TodoSchema = new Schema(
  {
    description: { type: String, required: true },
    status: { type: String, default: "pending" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true } // زمان ایجاد و بروزرسانی را به صورت خودکار اضافه می‌کند
);

// User Schema with validation
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // اطمینان از یکتایی ایمیل
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    todos: [TodoSchema],
    default: []
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields for the User
  }
);

// Check if the model already exists to avoid redefinition
const User = models?.User || model("User", UserSchema);

export default User;
