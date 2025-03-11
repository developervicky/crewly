import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { crewId: string };
}

const layout: FC<LayoutProps> = async ({ children, params }) => {
  const { crewId } = params;

  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  await connectDB();

  const crew = await Crew.findOne({ _id: crewId })
    .populate("members") // Convert `members` array (ObjectIds) into full Member objects
    .then((crew) => {
      if (!crew) return null;

      // Check if the user is in the `members` array
      const isMember = crew.members.some(
        (member: IMember) => member.userId.toString() === user._id.toString()
      );

      return isMember ? crew : null;
    });


  console.log(crew);

  return <div>{children}</div>;
};

export default layout;
