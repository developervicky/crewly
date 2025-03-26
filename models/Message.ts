import { InferSchemaType, model, models, Schema, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    fileUrl: { type: String },

    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type IMessage = InferSchemaType<typeof MessageSchema> & {
  _id: Types.ObjectId | string;
};

export const Message = models.Message || model("Message", MessageSchema);
