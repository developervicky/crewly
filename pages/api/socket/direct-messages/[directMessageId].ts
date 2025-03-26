import currentUserPages from "@/lib/current-user-pages";
import { connectDB } from "@/lib/mongoose";
import { Conversation } from "@/models/Conversation";
import { DirectMessage } from "@/models/DirectMessage";
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
    const { conversationId, directMessageId } = req.query;
    const { content } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectDB();

    const conversation = await Conversation.findById(conversationId).populate([
      "memberOneId",
      "memberTwoId",
    ]);

    if (!conversation) {
      return res.status(401).json({ error: "conversation not found" });
    }

    const member =
      conversation.memberOneId.userId.toString() === user._id.toString()
        ? conversation.memberOneId
        : conversation.memberTwoId;

    if (!member) {
      return res.status(400).json({ message: "member not found" });
    }

    let directMessage = await DirectMessage.findOne({
      _id: directMessageId,
      conversationId,
    }).populate({ path: "memberId", populate: { path: "userId" } });

    if (!directMessage || directMessage.deleted) {
      return res.status(401).json({ error: "directmessage not found" });
    }

    const isMessageOwner =
      directMessage.memberId._id.toString() === member._id.toString();
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res
        .status(401)
        .json({ error: "User not authorized to modify/delete" });
    }

    if (req.method === "DELETE") {
      directMessage = await DirectMessage.findByIdAndUpdate(
        directMessageId,
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

      directMessage = await DirectMessage.findByIdAndUpdate(
        directMessageId,
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

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAE_UPDATE_DELETE]", error);
    return res.status(500).json({ messae: "Internal Error" });
  }
}
