import { model, models, Schema } from "mongoose";

const MemberSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR", "GUEST"],
      default: "GUEST",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crewId: { type: Schema.Types.ObjectId, ref: "Crew", required: true },
  },
  { timestamps: true }
);

export const Member = models.Member || model("Member", MemberSchema);
