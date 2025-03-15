import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { ChannelTypes, CrewPopulated, MemberRoles } from "@/types";
import { BadgeCheck, Crown, Hash, Mic, Video } from "lucide-react";
import { redirect } from "next/navigation";
import CrewHeader from "./crew-header";
import CrewSearch from "./crew-search";
import { ScrollArea } from "./ui/scroll-area";

interface CrewSidebarProps {
  crewId: string;
}

const ChannelIcons = {
  [ChannelTypes.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelTypes.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelTypes.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const MemberRoleIcons = {
  [MemberRoles.GUEST]: null,
  [MemberRoles.ADMIN]: <Crown className="h-4 w-4 mr-2 text-amber-500" />,
  [MemberRoles.MODERATOR]: (
    <BadgeCheck className="h-4 w-4 mr-2 text-emerald-600" />
  ),
};

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
    .lean<CrewPopulated>();

  if (!crew) {
    redirect("/");
  }

  const serializedCrew: CrewPopulated = JSON.parse(JSON.stringify(crew));

  const TextChannels = serializedCrew.channels.filter(
    (channel) => channel.type === ChannelTypes.TEXT
  );
  const AudioChannels = serializedCrew.channels.filter(
    (channel) => channel.type === ChannelTypes.AUDIO
  );
  const VideoChannels = serializedCrew.channels.filter(
    (channel) => channel.type === ChannelTypes.VIDEO
  );
  const Members = serializedCrew.members.filter(
    (member) => member.userId._id !== user._id.toString()
  );

  const role = serializedCrew.members.find(
    (member) => member.userId._id === user._id.toString()
  )?.role;

  return (
    <div className="flex flex-col h-[95%] text-primary rounded-xl overflow-hidden w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <CrewHeader crew={serializedCrew} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <CrewSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: TextChannels.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: ChannelIcons["TEXT"],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: AudioChannels.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: ChannelIcons["AUDIO"],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: VideoChannels.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: ChannelIcons["VIDEO"],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: Members.map((member) => ({
                  id: member._id.toString(),
                  name: member.userId.name ?? "",
                  icon: MemberRoleIcons[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default CrewSidebar;
