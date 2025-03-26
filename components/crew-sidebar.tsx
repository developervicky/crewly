import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { ChannelTypes, CrewPopulated } from "@/types";
import { redirect } from "next/navigation";
import CrewChannel from "./crew-channel";
import CrewHeader from "./crew-header";
import CrewMember from "./crew-member";
import CrewSearch from "./crew-search";
import CrewSection from "./crew-section";
import { CustomIcon } from "./icon-map";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

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
    <div className="flex flex-col h-full md:h-[95%] text-primary md:rounded-xl overflow-hidden w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
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
                  icon: CustomIcon(ChannelTypes.TEXT, "mr-2"),
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: AudioChannels.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: CustomIcon(ChannelTypes.AUDIO, "mr-2"),
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: VideoChannels.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: CustomIcon(ChannelTypes.VIDEO, "mr-2"),
                })),
              },
              {
                label: "Members",
                type: "member",
                data: Members.map((member) => ({
                  id: member._id.toString(),
                  name: member.userId.name ?? "",
                  icon: CustomIcon(member.role, "mr-2"),
                })),
              },
            ]}
          />
        </div>
        <Separator className="text-gray-200 !h-[2px] dark:bg-gray-700 rounded-md my-2" />
        {!!TextChannels?.length && (
          <div className="mb-2">
            <CrewSection
              sectionType="channels"
              channelType={ChannelTypes.TEXT}
              role={role}
              label="Text Channels"
            />
            {TextChannels.map((channel) => (
              <CrewChannel
                key={channel._id.toString()}
                channel={channel}
                crew={serializedCrew}
                role={role}
              />
            ))}
          </div>
        )}
        {!!AudioChannels?.length && (
          <div className="mb-2">
            <CrewSection
              sectionType="channels"
              channelType={ChannelTypes.AUDIO}
              role={role}
              label="Voice Channels"
            />
            {AudioChannels.map((channel) => (
              <CrewChannel
                key={channel._id.toString()}
                channel={channel}
                crew={serializedCrew}
                role={role}
              />
            ))}
          </div>
        )}
        {!!VideoChannels?.length && (
          <div className="mb-2">
            <CrewSection
              sectionType="channels"
              channelType={ChannelTypes.VIDEO}
              role={role}
              label="Video Channels"
            />
            {VideoChannels.map((channel) => (
              <CrewChannel
                key={channel._id.toString()}
                channel={channel}
                crew={serializedCrew}
                role={role}
              />
            ))}
          </div>
        )}
        {!!Members?.length && (
          <div className="mb-2">
            <CrewSection
              sectionType="members"
              role={role}
              label="Members"
              crew={serializedCrew}
            />
            {Members.map((member) => (
              <CrewMember
                key={member._id.toString()}
                member={member}
                crew={serializedCrew}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CrewSidebar;
