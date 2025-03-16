import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { Member } from "@/models/Member";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const user = await currentUser();
    const { memberId } = await params;
    const { searchParams } = new URL(req.url);
    const crewId = searchParams.get("crewId");
    const memberUserId = searchParams.get("memberUserId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!crewId) {
      return new NextResponse("CrewId Missing", { status: 400 });
    }
    if (!memberUserId) {
      return new NextResponse("memberUserId Missing", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("MemberId Missing", { status: 400 });
    }

    await connectDB();

    const memberKickout = await Member.findByIdAndDelete(memberId);

    if (!memberKickout) {
      return new NextResponse("can't find member", { status: 400 });
    }

    const updateUser = await User.findByIdAndUpdate(
      memberUserId,
      {
        $pull: {
          members: memberId,
          crews: crewId,
        },
      },
      { new: true }
    );

    if (!updateUser) {
      return new NextResponse("Can't find the updated User", { status: 400 });
    }

    const crew = await Crew.findOneAndUpdate(
      { _id: crewId, userId: user._id },
      { $pull: { members: memberId } },
      { new: true }
    )
      .populate({
        path: "members",
        populate: {
          path: "userId",
        },
        options: { sort: { role: 1 } },
      })
      .populate({
        path: "channels",
        options: { sort: { createdAt: 1 } },
      });

    if (!crew) {
      return new NextResponse("Can't find the updated crew", { status: 400 });
    }

    return NextResponse.json(crew);
  } catch (error) {
    console.log(error);
    return new NextResponse("[MEMBER_KICKOUT_ERROR]", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const user = await currentUser();
    const { memberId } = await params;
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const crewId = searchParams.get("crewId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!crewId) {
      return new NextResponse("CrewId Missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("MemberId Missing", { status: 400 });
    }
    await connectDB();

    const memberUpdate = await Member.findOneAndUpdate(
      { _id: memberId, crewId },
      { $set: { role } },
      { new: true }
    );

    if (!memberUpdate) {
      return new NextResponse("Can't find the member", { status: 400 });
    }

    const crew = await Crew.findOne({ _id: crewId, userId: user._id })
      .populate({
        path: "members",
        populate: {
          path: "userId",
        },
        options: { sort: { role: 1 } },
      })
      .populate({
        path: "channels",
        options: { sort: { createdAt: 1 } },
      });

    if (!crew) {
      return new NextResponse("Can't find the updated crew", { status: 400 });
    }

    return NextResponse.json(crew);
  } catch (error) {
    console.log(error);
    return new NextResponse("[ROLE_CHANGE_ERROR]", { status: 500 });
  }
}
