import currentUser from "@/lib/current-user";
import { IMessage, Message } from "@/models/Message";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("channelId missing", { status: 400 });
    }

    let messages: IMessage[] = [];
    if (cursor) {
      messages = await Message.find({
        channelId: channelId,
        _id: { $lt: cursor }, // `cursor` should be the last message's `_id` for pagination
      })
        .sort({ createdAt: -1 }) // Order by newest first
        .limit(MESSAGES_BATCH) // Limit batch size
        .populate({
          path: "memberId",
          populate: {
            path: "userId",
          },
        });
    } else {
      messages = await Message.find({ channelId }) // Filter by `channelId`
        .sort({ createdAt: -1 }) // Order by newest first
        .limit(MESSAGES_BATCH) // Limit batch size
        .populate({
          path: "memberId",
          populate: { path: "userId" }, // Nested population
        });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1]._id;
    }

    // console.log(messages);

    return NextResponse.json({
      messages: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGE_GET]", error);
    return new NextResponse("[MESSAGE_GET]", { status: 500 });
  }
}
