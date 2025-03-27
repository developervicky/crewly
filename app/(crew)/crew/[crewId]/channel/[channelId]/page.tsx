import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import MediaRoom from "@/components/media-room";
import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel, IChannel } from "@/models/Channel";
import { Crew, ICrew } from "@/models/Crew";
import { IMember, Member } from "@/models/Member";
import { ChannelTypes } from "@/types";
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

  const CrewJson: ICrew = JSON.parse(JSON.stringify(crew));
  const ChannelJson: IChannel = JSON.parse(JSON.stringify(channel));
  const MemberJson: IMember = JSON.parse(JSON.stringify(member));

  // console.log(MemberJson);
  // console.log(CrewJson);
  // console.log(ChannelJson);

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] md:mr-6 md:h-[95%] md:rounded-xl dark:bg-[#2B2D31]">
      <ChatHeader
        crewId={ChannelJson.crewId.toString()}
        name={ChannelJson.name}
        type="channel"
      />
      {ChannelJson.type === ChannelTypes.TEXT && (
        <>
          <ChatMessages
            name={ChannelJson.name}
            member={MemberJson}
            chatId={ChannelJson._id.toString()}
            apiUrl={"/api/messages"}
            socketUrl={"/api/socket/messages"}
            socketQuery={{
              channelId: ChannelJson._id.toString(),
              crewId: CrewJson._id.toString(),
            }}
            paramKey={"channelId"}
            paramValue={ChannelJson._id.toString()}
            type={"channel"}
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            name={ChannelJson?.name}
            query={{
              channelId: ChannelJson?._id.toString(),
              crewId: CrewJson?._id.toString(),
            }}
            type="channel"
          />
        </>
      )}
      {ChannelJson.type === ChannelTypes.AUDIO && (
        <MediaRoom
          audio={true}
          video={false}
          chatId={ChannelJson._id.toString()}
        />
      )}
      {ChannelJson.type === ChannelTypes.VIDEO && (
        <MediaRoom
          audio={true}
          video={true}
          chatId={ChannelJson._id.toString()}
        />
      )}
    </div>
  );
};

export default ChannelIdPage;
