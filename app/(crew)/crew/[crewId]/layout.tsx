import CrewSidebar from "@/components/crew-sidebar";
import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { IMember } from "@/models/Member";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps {
  params: Promise<{ crewId: string }>;
  children: React.ReactNode;
}

const layout = async ({ params, children }: LayoutProps) => {
  const { crewId } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const NonMember = () => {
    return (
      <div className=" flex items-center justify-center h-screen text-2xl font-semibold">
        You are not a part of this crew! 👀
      </div>
    );
  };

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

  if (!crew) {
    return <NonMember />;
  }

  // console.log(crew);

  return (
    <div className="h-full">
      <div className="hidden md:flex items-center justify-center h-full w-60 z-20 ml-6 flex-col fixed inset-y-0">
        <CrewSidebar crewId={crewId} />
      </div>
      <main className="h-full md:pl-[288px] flex flex-col items-center justify-center w-full">
        {children}
      </main>
    </div>
  );
};

export default layout;
