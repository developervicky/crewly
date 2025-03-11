/* @next-codemod-ignore */
import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps {
  params: { crewId: string };
  children: React.ReactNode;
}

const layout = async ({ params, children }: LayoutProps) => {
  const { crewId } = await params;
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
