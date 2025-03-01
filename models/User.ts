import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    emailVerified: Date,
    userId: String,
    crews: [{ type: Schema.Types.ObjectId, ref: "Crew" }],
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
