import currentUserPages from "@/lib/current-user-pages";
import { connectDB } from "@/lib/mongoose";
import { Conversation } from "@/models/Conversation";
import { DirectMessage } from "@/models/DirectMessage";
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
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(401).json({ message: "conversationId missing" });
    }

    await connectDB();

    const conversation = await Conversation.findById(conversationId).populate([
      "memberOneId",
      "memberTwoId",
    ]);

    if (!conversation) {
      return res.status(400).json({ message: "conversation not found" });
    }

    const member =
      conversation.memberOneId.userId.toString() === user._id.toString()
        ? conversation.memberOneId
        : conversation.memberTwoId;

    if (!member) {
      return res.status(400).json({ message: "member not found" });
    }

    let directMessage;

    if (fileUrl) {
      directMessage = await DirectMessage.create({
        content: fileName,
        fileUrl,
        conversationId,
        memberId: member._id,
      });
    } else {
      directMessage = await DirectMessage.create({
        content,
        conversationId,
        memberId: member._id,
      });
    }

    if (!directMessage) {
      return res
        .status(400)
        .json({ message: "direct message can't be created" });
    }

    const populatedMessage = await directMessage.populate({
      path: "memberId",
      populate: { path: "userId" },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, directMessage);

    return res.status(200).json(populatedMessage);
  } catch (error) {
    console.log("[DIRECTMESSAGE_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
