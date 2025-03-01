import mongoose, { model, models, Schema } from "mongoose";

const crewSchema = new Schema(
  {
    name: String,
    imageUrl: String,
    inviteCode: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

export const Crew = models.Crew || model("Crew", crewSchema);
