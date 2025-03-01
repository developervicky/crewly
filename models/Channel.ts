import { model, models, Schema } from "mongoose";

const ChannelSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["TEXT", "AUDIO", "VIDEO"],
      default: "TEXT",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crewId: { type: Schema.Types.ObjectId, ref: "Crew", required: true },
  },
  { timestamps: true }
);
export const Channel = models.Channel || model("Channel", ChannelSchema);
