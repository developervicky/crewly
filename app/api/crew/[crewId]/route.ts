import currentUser from "@/lib/current-user";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { Member } from "@/models/Member";
import { NextResponse } from "next/server";

export async function DELETE(
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
      return new NextResponse("CrewId missing", { status: 400 });
    }

    const deletedCrew = await Crew.findById(crewId);

    if (!deletedCrew) {
      return new NextResponse("Crew is not found", { status: 400 });
    }

    if (deletedCrew.userId.toString() !== user._id.toString()) {
      return new NextResponse("Forbidden: You can't delete this crew", { status: 403 });
    }

    await Channel.deleteMany({ _id: { $in: deletedCrew.channels } });
    await Member.deleteMany({ _id: { $in: deletedCrew.members } });
    
    await Crew.deleteOne({ _id: crewId });

    return new Response("Crew and related data deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("[CREW_DELETION]", { status: 500 });
  }
}

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
      return new NextResponse("CrewId Missing", { status: 400 });
    }

    const { name, imageUrl } = await req.json();

    const crew = await Crew.findOneAndUpdate(
      {
        _id: crewId,
        userId: user._id,
      },
      { $set: { name, imageUrl } },
      { new: true }
    );

    return NextResponse.json(crew);
  } catch (error) {
    console.log("[CREW_EDIT]", error);
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
}
