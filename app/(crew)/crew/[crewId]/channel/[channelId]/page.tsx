import ChatHeader from "@/components/chat-header";
import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
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
  const crew = await Crew.findById(crewId);
  const channel = await Channel.findOne({ _id: channelId, userId: user._id });

  if (!crew || !channel) {
    redirect("/");
  }
  
  return (
    <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] flex flex-col h-full md:h-[95%] w-full md:rounded-xl md:mr-6">
      <ChatHeader crewId={channel.crewId} name={channel.name} type="channel" />
    </div>
  );
};

export default ChannelIdPage;
