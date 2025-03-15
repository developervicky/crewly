import currentUser from "@/lib/current-user";
import { Crew } from "@/models/Crew";
import { Member } from "@/models/Member";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const user = await currentUser();
    const { crewId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!crewId) {
      return new NextResponse("crewId not found", { status: 400 });
    }

    const deletedMember = await Member.findOne({
      userId: user._id,
      crewId,
    });

    if (!deletedMember) {
      return new NextResponse("User already left the crew", { status: 400 });
    }

    const updateCrew = await Crew.findByIdAndUpdate(
      crewId,
      {
        $pull: { members: deletedMember._id },
      },
      { new: true }
    );

    if (!updateCrew) {
      return new NextResponse("Crew can't find", { status: 400 });
    }

    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          members: deletedMember._id,
          crews: crewId,
        },
      },
      { new: true }
    );

    if (!updateUser) {
      return new NextResponse("User can't find", { status: 400 });
    }

    const removedMember = await Member.findOneAndDelete({
      _id: deletedMember._id,
      userId: user._id,
    });

    if (!removedMember) {
      return new NextResponse("Failed to remove member", { status: 400 });
    }

    return new NextResponse("Member left successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("[MEMBER_LEAVE]", { status: 500 });
  }
}
