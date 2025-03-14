import { InferSchemaType, model, models, Schema, Types } from "mongoose";

export enum ChannelTypes {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

const ChannelSchema = new Schema(
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

export type IChannel = InferSchemaType<typeof ChannelSchema> & {
  _id: Types.ObjectId | string;
};

export const Channel = models.Channel || model("Channel", ChannelSchema);
