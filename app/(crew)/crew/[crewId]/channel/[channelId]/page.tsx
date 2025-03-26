import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { Member } from "@/models/Member";
import { redirect } from "next/navigation";

const ChannelIdPage = async ({
  params,
}: {
  params: Promise<{ crewId: string; channelId: string }>;
}) => {
  const user = await currentUser();
  const { crewId, channelId } = await params;
  if (!user) {
    redirect("/");
  }

  await connectDB();
  const crew = await Crew.findById(crewId).lean();
  const channel = await Channel.findById(channelId).lean();
  const member = await Member.findOne({
    userId: user._id,
    crewId: crewId,
  }).lean();

  if (!crew || !channel || !member) {
    redirect("/");
  }

  const CrewJson = JSON.parse(JSON.stringify(crew));
  const ChannelJson = JSON.parse(JSON.stringify(channel));
  const MemberJson = JSON.parse(JSON.stringify(member));

  // console.log(MemberJson);
  // console.log(CrewJson);
  // console.log(ChannelJson);

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] md:mr-6 md:h-[95%] md:rounded-xl dark:bg-[#2B2D31]">
      <ChatHeader
        crewId={ChannelJson.crewId}
        name={ChannelJson.name}
        type="channel"
      />
      <ChatMessages
        name={ChannelJson.name}
        member={MemberJson}
        chatId={ChannelJson._id}
        apiUrl={"/api/messages"}
        socketUrl={"/api/socket/messages"}
        socketQuery={{
          channelId: ChannelJson._id,
          crewId: CrewJson._id,
        }}
        paramKey={"channelId"}
        paramValue={ChannelJson._id}
        type={"channel"}
      />
      <ChatInput
        apiUrl="/api/socket/messages"
        name={ChannelJson?.name}
        query={{ channelId: ChannelJson?._id, crewId: CrewJson?._id }}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
