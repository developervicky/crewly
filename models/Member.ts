import { model, models, Schema } from "mongoose";

export const MemberRoles = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  GUEST: "GUEST",
};

const MemberSchema = new Schema(
  {
    role: {
      type: String,
      enum: Object.values(MemberRoles),
      default: MemberRoles.GUEST,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crewId: { type: Schema.Types.ObjectId, ref: "Crew", required: true },
  },
  { timestamps: true }
);

export const Member = models.Member || model("Member", MemberSchema);
