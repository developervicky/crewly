import { Conversation } from "@/models/Conversation";
import { connectDB } from "./mongoose";

export const GetOrCreateNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  await connectDB();

  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    await connectDB();

    const conversation = await Conversation.findOne({
      memberOneId: memberOneId,
      memberTwoId: memberTwoId,
    })
      .populate({
        path: "memberOneId",
        populate: { path: "userId" },
      })
      .populate({
        path: "memberTwoId",
        populate: { path: "userId" },
      })
      .lean();

    const JsonConversation = JSON.parse(JSON.stringify(conversation));

    return JsonConversation;
  } catch (error) {
    console.log("FINDING_CONVERSATION", error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    await connectDB();

    const conversation = await Conversation.create({
      memberOneId,
      memberTwoId,
    });

    const newConversation = await conversation
      .populate([
        {
          path: "memberOneId",
          populate: { path: "userId" },
        },
        {
          path: "memberTwoId",
          populate: { path: "userId" },
        },
      ])
      .lean();

    const JsonConversation = JSON.parse(JSON.stringify(newConversation));

    return JsonConversation;
  } catch (error) {
    console.log("CREATE_CONVERSATION", error);
  }
};
