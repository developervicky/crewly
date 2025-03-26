import currentUserPages from "@/lib/current-user-pages";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { Message } from "@/models/Message";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const user = await currentUserPages({ req, res });

    if (!user) return res.status(401).json("Unauthorized");

    const { content, fileName, fileUrl } = req.body;
    const { channelId, crewId } = req.query;

    if (!channelId) {
      return res.status(401).json({ message: "channelId missing" });
    }
    if (!crewId) {
      return res.status(401).json({ message: "crewId missing" });
    }

    await connectDB();

    const crew = await Crew.findOne({
      _id: crewId,
    }).populate({
      path: "members",
      match: { userId: user._id },
      populate: { path: "userId" },
    });

    if (!crew) {
      return res.status(400).json({ message: "crew not found" });
    }

    const channel = await Channel.findOne({ _id: channelId, crewId: crew._id });

    if (!channel) {
      return res.status(400).json({ message: "channel not found" });
    }

    const member: IMember = crew.members.find(
      (member: IMember) => member.userId._id.toString() === user._id.toString(),
    );

    if (!member) {
      return res.status(400).json({ message: "member not found" });
    }

    let message;

    if (fileUrl) {
      message = await Message.create({
        content: fileName,
        fileUrl: fileUrl,
        channelId: channelId,
        memberId: member._id,
      });
    } else {
      message = await Message.create({
        content: content,
        channelId: channelId,
        memberId: member._id,
      });
    }

    if (!message) {
      return res.status(400).json({ message: "message can't be created" });
    }

    const populatedMessage = await message.populate({
      path: "memberId",
      populate: { path: "userId" },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(populatedMessage);
  } catch (error) {
    console.log("[MESSAGE_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
