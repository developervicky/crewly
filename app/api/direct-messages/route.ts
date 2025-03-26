import currentUser from "@/lib/current-user";
import { DirectMessage, IDirectMessage } from "@/models/DirectMessage";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("conversationId missing", { status: 400 });
    }

    let directMessages: IDirectMessage[] = [];
    if (cursor) {
      directMessages = await DirectMessage.find({
        conversationId: conversationId,
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
      directMessages = await DirectMessage.find({ conversationId }) // Filter by `channelId`
        .sort({ createdAt: -1 }) // Order by newest first
        .limit(MESSAGES_BATCH) // Limit batch size
        .populate({
          path: "memberId",
          populate: { path: "userId" }, // Nested population
        });
    }

    let nextCursor = null;

    if (directMessages.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1]._id;
    }

    // console.log(messages);

    return NextResponse.json({
      messages: directMessages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECTMESSAGE_GET]", error);
    return new NextResponse("[DIRECTMESSAGE_GET]", { status: 500 });
  }
}
