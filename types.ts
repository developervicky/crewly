import { ICrew } from "./models/Crew";
import { IMember } from "./models/Member";
import { IUser } from "./models/User";

export type CrewPopulated = ICrew & {
  members: (IMember & { userId: IUser })[];
};
