import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const crewId = searchParams.get("crewId");
    const { name, type } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!crewId) {
      return new NextResponse("CrewId missing", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("general can't be channel name", { status: 400 });
    }

    await connectDB();

    const newChannel = await Channel.create({
      name,
      type,
      crewId,
      userId: user._id,
    });

    if (!newChannel) {
      return new NextResponse("Channel can't create", { status: 400 });
    }

    const updateCrew = await Crew.findByIdAndUpdate(
      crewId,
      {
        $addToSet: { channels: newChannel._id },
      },
      { new: true }
    );

    if (!updateCrew) {
      return new NextResponse("Crew update failed - invalid crewId?", {
        status: 400,
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { channels: newChannel._id },
      },
      { new: true }
    );

    if (!updateUser) {
      return new NextResponse("User update failed - invalid userId?", {
        status: 400,
      });
    }

    return NextResponse.json(newChannel);
  } catch (error) {
    console.log(error);
    return new NextResponse("[CHANNEL_CREATE]", { status: 500 });
  }
}
