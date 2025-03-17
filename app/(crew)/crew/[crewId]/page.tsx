import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { redirect } from "next/navigation";

const CrewIdPage = async ({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) => {
  const { crewId } = await params;
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  await connectDB();

  const generalChannel = await Crew.findOne({
    _id: crewId,
  })
    .populate({
      path: "channels",
      match: { name: "general" },
      options: { sort: { createdAt: 1 } },
    })
    .select("channels") // Select only the channels field
    .exec();

  console.log(generalChannel.channels[0].name);

  const channelName = generalChannel.channels[0].name;

  if (channelName !== "general") {
    return null;
  }
  return redirect(
    `/crew/${crewId}/channel/${generalChannel.channels[0]._id.toString()}`
  );
};

export default CrewIdPage;
