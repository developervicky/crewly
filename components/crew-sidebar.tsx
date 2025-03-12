import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { ChannelTypes, IChannel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { redirect } from "next/navigation";
import React from "react";
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
    });

  if (!crew) {
    redirect("/");
  }

  const TextChannels = crew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.TEXT
  );
  const AudioChannels = crew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.AUDIO
  );
  const VideoChannels = crew.channels.filter(
    (channel: IChannel) => channel.type === ChannelTypes.VIDEO
  );
  const Members = crew.members.filter(
    (member: IMember) => member.userId._id.toString() !== user._id.toString()
  );

  const role = crew.members.find(
    (member: IMember) => member.userId._id.toString() === user._id.toString()
  )?.role;

  console.log(crew);

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <CrewHeader crew={crew} role={role} />
    </div>
  );
};

export default CrewSidebar;
