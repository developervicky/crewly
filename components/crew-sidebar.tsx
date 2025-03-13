import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { ChannelTypes, IChannel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { redirect } from "next/navigation";
import CrewHeader from "./crew-header";

interface CrewSidebarProps {
  crewId: string;
}

const CrewSidebar = async ({ crewId }: CrewSidebarProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }
  
  await connectDB();
  const crew = await Crew.findById(crewId)
    .populate({
      path: "channels",
      options: { sort: { createdAt: 1 } },
    })
    .populate({
      path: "members",
      populate: {
        path: "userId",
      },
      options: { sort: { role: 1 } },
    })
    .lean();

  if (!crew) {
    redirect("/");
  }
  const serializedCrew = JSON.parse(JSON.stringify(crew));

  const TextChannels = serializedCrew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.TEXT
  );
  const AudioChannels = serializedCrew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.AUDIO
  );
  const VideoChannels = serializedCrew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.VIDEO
  );
  const Members = serializedCrew.members.filter(
    (member: IMember) =>
      typeof member.userId === "object" &&
      member.userId._id !== user._id.toString()
  );

  const role = serializedCrew.members.find(
    (member: IMember) =>
      typeof member.userId === "object" &&
      member.userId._id === user._id.toString()
  )?.role;

  console.log(role);

  return (
    <div className="flex flex-col h-[95%] text-primary rounded-xl overflow-hidden w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <CrewHeader crew={serializedCrew} role={role} />
    </div>
  );
};

export default CrewSidebar;
