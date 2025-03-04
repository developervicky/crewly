import CurrentUser from "@/lib/current-user";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { NextResponse } from "next/server";
import { Channel } from "@/models/Channel";
import { Member, MemberRoles } from "@/models/Member";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const user = await CurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const newCrew = new Crew({
      userId: user._id,
      name,
      imageUrl,
      inviteCode: uuidv4(),
    });

    // Create the default "general" channel
    const channel = await Channel.create({
      name: "general",
      userId: user._id, // Link channel to user
      crewId: newCrew._id, // Link channel to server
    });

    // Create a member for the server
    const member = await Member.create({
      userId: user._id,
      crewId: newCrew._id,
      role: MemberRoles.ADMIN,
    });

    // Push the created references into the Server document
    newCrew.channels.push(channel._id);
    newCrew.members.push(member._id);

    // Save the updated server document
    await newCrew.save();

    return NextResponse.json(newCrew);
  } catch (error) {
    console.log("[CREW_CREATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
