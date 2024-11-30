import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
    },
    company: {
      type: String,
      maxlength: 255,
      default: null,
    },
    industry: {
      type: String,
      maxlength: 255,
      default: null,
    },
    type: {
      type: String,
      maxlength: 255,
      default: null,
    },
    country: {
      type: String,
      maxlength: 255,
      default: null,
    },
    is_sub_marketing: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  {
    collection: "users",
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
