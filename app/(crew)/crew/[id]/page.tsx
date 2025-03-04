import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import React from "react";

const CrewIdPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  await connectDB();
  const crew = await Crew.findOne({ _id: id }).populate("members");

  console.log(crew.members);

  return <div>CrewIdPage</div>;
};

export default CrewIdPage;
