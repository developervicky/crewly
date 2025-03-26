import currentUserPages from "@/lib/current-user-pages";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { Message } from "@/models/Message";
import { MemberRoles, NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await currentUserPages({ req, res });
    const { messageId, crewId, channelId } = req.query;
    const { content } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectDB();
    const crew = await Crew.findOne({ _id: crewId })
      .populate("members")
      .then((crew) => {
        if (!crew) return null;

        const isMember = crew.members.some(
          (member: IMember) =>
            member.userId._id.toString() === user._id.toString(),
        );

        return isMember ? crew : null;
      });

    if (!crew) {
      return res.status(401).json({ error: "crew not found" });
    }

    const channel = await Channel.findOne({
      _id: channelId,
      crewId: crewId,
    });

    if (!channel) {
      return res.status(401).json({ error: "channel not found" });
    }

    const member = crew.members.find(
      (member: IMember) => member.userId.toString() === user._id.toString(),
    );

    if (!member) {
      return res.status(401).json({ error: "Member not found" });
    }

    let message = await Message.findOne({
      _id: messageId,
      channelId: channelId,
    }).populate({ path: "memberId", populate: { path: "userId" } });

    if (!message || message.deleted) {
      return res.status(401).json({ error: "message not found" });
    }

    const isMessageOwner =
      message.memberId._id.toString() === member._id.toString();
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res
        .status(401)
        .json({ error: "User not authorized to modify/delete" });
    }

    if (req.method === "DELETE") {
      message = await Message.findByIdAndUpdate(
        messageId,
        {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        { new: true },
      ).populate({
        path: "memberId",
        populate: {
          path: "userId",
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(400).json({ error: "User not authorized to update" });
      }

      message = await Message.findByIdAndUpdate(
        messageId,
        {
          content,
        },
        { new: true },
      ).populate({
        path: "memberId",
        populate: {
          path: "userId",
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAE_UPDATE_DELETE]", error);
    return res.status(500).json({ messae: "Internal Error" });
  }
}
