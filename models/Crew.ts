import { CallbackError, model, models, Schema } from "mongoose";
import { Member } from "./Member";
import { Channel } from "./Channel";

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

// ✅ Handles `findOneAndDelete()` and `deleteMany()` (query method)
crewSchema.pre("findOneAndDelete", async function (next) {
  try {
    const crew = await this.model.findOne(this.getFilter()); // Get the crew being deleted
    if (crew) {
      await Member.deleteMany({ crewId: crew._id });
      await Channel.deleteMany({ crewId: crew._id });
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const Crew = models.Crew || model("Crew", crewSchema);
