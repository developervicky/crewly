import {
  CallbackError,
  InferSchemaType,
  model,
  models,
  Schema,
} from "mongoose";
import { Channel } from "./Channel";
import { Member } from "./Member";
import { Types } from "mongoose";

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

// ✅ Handles `deleteOne()` (instance method)
crewSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Member.deleteMany({ crewId: this._id }); // Remove members
      await Channel.deleteMany({ crewId: this._id }); // Remove channels
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  }
);

export type ICrew = InferSchemaType<typeof crewSchema> & { _id: Types.ObjectId | string };

export const Crew = models.Crew || model("Crew", crewSchema);
