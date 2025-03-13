import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { Member } from "@/models/Member";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: { inviteCode: string };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { inviteCode } = await params;
  const user = await currentUser();
  if (!user || !inviteCode) {
    return redirect("/");
  }

  await connectDB();
  const existingMember = await Crew.findOne({ inviteCode }).populate({
    path: "members",
    match: { userId: user._id },
  });

  if (!existingMember) {
    console.log("no crew existed");
    return redirect("/");
  }

  if (existingMember.members.length > 0) {
    console.log("You are an existing member of this crew");
    return redirect(`/crew/${existingMember._id}`);
  }


  const newMember = await Member.create({
    userId: user._id,
    crewId: existingMember._id,
  });

  const addMemberToCrew = await Crew.findOneAndUpdate(
    { inviteCode },
    { $addToSet: { members: newMember._id } },
    { new: true }
  );

  await User.findByIdAndUpdate(user._id, {
    $addToSet: {
      members: newMember._id,
      crews: addMemberToCrew._id,
    },
  });

  if (addMemberToCrew) {
    console.log("added to crew");
    return redirect(`/crew/${addMemberToCrew._id}`);
  }

  return null;
};

export default InvitePage;
