import { IChannel } from "./models/Channel";
import { ICrew } from "./models/Crew";
import { IDirectMessage } from "./models/DirectMessage";
import { IMember } from "./models/Member";
import { IMessage } from "./models/Message";
import { IUser } from "./models/User";

import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type CrewPopulated = Omit<ICrew, "members" | "channels"> & {
  members: (IMember & { userId: IUser })[];
  channels: IChannel[];
};

export type MessageWithMemberAndUser = IMessage & {memberId : IMember & {userId : IUser} }

export type DirectMessageWithMemberAndUser = IDirectMessage & {memberId : IMember & {userId : IUser} }

export enum ChannelTypes {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export enum MemberRoles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}
