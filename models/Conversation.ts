import { InferSchemaType, model, models, Schema, Types } from "mongoose";

const ConversationSchema = new Schema(
  {
    memberOneId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    memberTwoId: { type: Schema.Types.ObjectId, ref: "Member", required: true },

    directMessages: [{ type: Schema.Types.ObjectId, ref: "DirectMessage" }],
  },
  { timestamps: true },
);

// Avoid same conversation creating again and again, if it already existing
ConversationSchema.index({ memberOneId: 1, memberTwoId: 1 }, { unique: true });

export type IConversation = InferSchemaType<typeof ConversationSchema> & {
  _id: Types.ObjectId | string;
};

export const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);
