import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import MediaRoom from "@/components/media-room";
import { GetOrCreateNewConversation } from "@/lib/conversation";
import currentUser from "@/lib/current-user";
import { Member } from "@/models/Member";
import { redirect } from "next/navigation";

const MemberIdPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ crewId: string; memberId: string }>;
  searchParams: Promise<{ video?: boolean }>;
}) => {
  const { crewId, memberId } = await params;

  const { video } = await searchParams;

  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const currentMember = await Member.findOne({
    userId: user._id,
    crewId: crewId,
  })
    .populate({
      path: "userId",
    })
    .lean();

  const JsonCurrentMember = JSON.parse(JSON.stringify(currentMember));

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await GetOrCreateNewConversation(
    JsonCurrentMember._id,
    memberId,
  );

  if (!conversation) {
    return redirect(`/crew/${crewId}`);
  }

  const { memberOneId, memberTwoId } = conversation;

  const otherMember =
    JsonCurrentMember.userId._id.toString() === user._id.toString()
      ? memberTwoId
      : memberOneId;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] md:mr-6 md:h-[95%] md:rounded-xl dark:bg-[#2B2D31]">
      <ChatHeader
        crewId={crewId}
        name={otherMember?.userId?.name}
        type="member"
        image={otherMember?.userId?.image}
      />
      {video && (
        <MediaRoom chatId={conversation?._id} audio={true} video={true} />
      )}
      {!video && (
        <>
          <ChatMessages
            name={otherMember?.userId?.name}
            type="conversation"
            apiUrl="/api/direct-messages"
            chatId={conversation?._id}
            member={JsonCurrentMember}
            paramKey="conversationId"
            paramValue={conversation?._id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation._id,
            }}
          />
          <ChatInput
            name={otherMember?.userId?.name}
            apiUrl="/api/socket/direct-messages"
            type="member"
            query={{
              conversationId: conversation?._id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
