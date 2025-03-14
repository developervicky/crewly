import { IChannel } from "./models/Channel";
import { ICrew } from "./models/Crew";
import { IMember } from "./models/Member";
import { IUser } from "./models/User";

export type CrewPopulated = Omit<ICrew, "members" | "channels"> & {
  members: (IMember & { userId: IUser })[];
  channels: IChannel[];
};
