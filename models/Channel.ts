import { model, models, Schema, Types } from "mongoose";

export enum ChannelTypes {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}
export interface IChannel {
  _id?: Types.ObjectId;
  name: string;
  type: ChannelTypes;
  userId: Types.ObjectId;
  crewId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date; 
}

const ChannelSchema = new Schema<IChannel>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(ChannelTypes),
      default: ChannelTypes.TEXT,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crewId: { type: Schema.Types.ObjectId, ref: "Crew", required: true },
  },
  { timestamps: true }
);
export const Channel = models.Channel || model("Channel", ChannelSchema);
