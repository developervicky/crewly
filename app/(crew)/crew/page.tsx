import InitialModal from "@/components/initial-modal";
import initialProfile from "@/lib/initial-profile";
import { connectDB } from "@/lib/mongoose";
import { Member } from "@/models/Member";
import { redirect } from "next/navigation";
import React from "react";

const CrewPage = async () => {
  const user = await initialProfile();

  await connectDB();
  const member = await Member.findOne({ userId: user._id }); // we are checking whether the user is a member of a crew

  // console.log(user);

  // If he is a member of a crew, redirect him to the crew page using the crewId
  if (member) {
    return redirect(`/crew/${member.crewId}`);
  }

  return <InitialModal />;
};

export default CrewPage;
