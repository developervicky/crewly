import { InferSchemaType, model, models, Schema, Types } from "mongoose";

const DirectMessageSchema = new Schema(
  {
    content: { type: String, required: true },
    fileUrl: { type: String },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type IDirectMessage = InferSchemaType<typeof DirectMessageSchema> & {
  _id: Types.ObjectId | string;
};

export const DirectMessage =
  models.DirectMessage || model("DirectMessage", DirectMessageSchema);
