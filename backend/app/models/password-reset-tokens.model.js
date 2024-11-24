import mongoose from "mongoose"

const passwordResetTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
    },
    token: {
      type: String,
      required: true,
      maxlength: 255,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "password_reset_token",
    timestamps: true
  }
);

const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  passwordResetTokenSchema
);

export default PasswordResetToken