import { MemberRoles } from "@/types";
import { InferSchemaType, model, models, Schema, Types } from "mongoose";

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

    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],

    directMessages: [{type: Schema.Types.ObjectId, ref: "DirectMessage"}],

    conversationsInitiated: [{type: Schema.Types.ObjectId, ref:"Conversation"}],
    conversationsReceived: [{type: Schema.Types.ObjectId, ref:"Conversation"}]

  },
  { timestamps: true }
);

export type IMember = InferSchemaType<typeof MemberSchema> & {
  _id: Types.ObjectId | string;
};

export const Member = models.Member || model("Member", MemberSchema);
