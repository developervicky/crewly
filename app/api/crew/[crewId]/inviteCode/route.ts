import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: NextRequest,
  context: { params: { crewId: string } }
) {
  try {
    const user = await currentUser();

    const { params } = context;
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.crewId) {
      return new NextResponse("CrewId Missing", { status: 400 });
    }

    await connectDB();
    const crew = await Crew.findOneAndUpdate(
      {
        _id: params.crewId,
        userId: user._id,
      },
      {
        $set: { inviteCode: uuidv4() },
      },
      { new: true }
    );

    if (!crew) {
      return new NextResponse("Can't fetch and update the Crew", {
        status: 400,
      });
    }

    return NextResponse.json(crew);
  } catch (error) {
    console.log("[INVITE_LINK_UPDATE]", error);
    return new NextResponse("INVITE_LINK_UPDATE", { status: 500 });
  }
}
