import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const user = await currentUser();
    const { channelId } = await params;
    const { searchParams } = new URL(req.url);
    const crewId = searchParams.get("crewId");
    const { name, type } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("No channelId", { status: 400 });
    }
    if (!crewId) {
      return new NextResponse("crewId not found", { status: 400 });
    }

    const updateChannel = await Channel.findOneAndUpdate(
      {
        _id: channelId,
      },
      {
        $set: { name, type },
      },
      { new: true }
    );

    if (!updateChannel) {
      return new NextResponse("Channel can't be updated", { status: 400 });
    }

    return NextResponse.json(updateChannel);
  } catch (error) {
    console.log(error);
    return new NextResponse("[CHANNEL_UPDATE]", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const { channelId } = await params;
    const crewId = searchParams.get("crewId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("ChannelId missing", { status: 400 });
    }

    await connectDB();

    const deletedChannel = await Channel.findByIdAndDelete(channelId);

    if (!deletedChannel) {
      return new NextResponse("No Channel found", { status: 400 });
    }

    const updatedCrew = await Crew.findOneAndUpdate(
      { _id: crewId },
      { $pull: { channels: channelId } },
      { new: true }
    );

    if (!updatedCrew) {
      return new NextResponse("Crew can't be updated", { status: 400 });
    }

    return new NextResponse("Channel has deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("[CHANNEL_DELETION]", { status: 500 });
  }
}
