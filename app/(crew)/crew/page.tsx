import initialProfile from "@/lib/initial-profile";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { redirect } from "next/navigation";
import React from "react";

const CrewPage = async () => {
  const user = await initialProfile();

  await connectDB();
  const crew = await Crew.findOne({ "members.userID": user._id });

  console.log(user);

  if (crew) {
    return redirect(`/crew/${crew._id}`);
  }

  return <div>Create your Crew</div>;
};

export default CrewPage;
