import { Schema, model, models } from "mongoose";
import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId; // Optional, MongoDB auto-generates this
  name?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  userId?: string; // Optional if generated elsewhere
  crews: Types.ObjectId[]; // Array of Crew ObjectIds
  members: Types.ObjectId[]; // Array of Member ObjectIds
  channels: Types.ObjectId[]; // Array of Channel ObjectIds
  createdAt?: Date; // Mongoose timestamps
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    emailVerified: Date,
    userId: String,
    crews: [{ type: Schema.Types.ObjectId, ref: "Crew" }],
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
