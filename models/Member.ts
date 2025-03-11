import { model, models, Schema, Types } from "mongoose";

export enum MemberRoles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

export interface IMember {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  crewId: Types.ObjectId;
  role: MemberRoles;
  createdAt?: Date;
  updatedAt?: Date; 
}

const MemberSchema = new Schema<IMember>(
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
