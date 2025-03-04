import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import React from "react";

interface PageProps {
  params: { id: string };
}
const CrewIdPage = async ({ params }: PageProps) => {
  const { id } = params;
  await connectDB();
  const crew = await Crew.findOne({ _id: id }).populate("members");

  console.log(crew.members);

  return <div>CrewIdPage</div>;
};

export default CrewIdPage;
