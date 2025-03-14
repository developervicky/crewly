import CurrentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Channel } from "@/models/Channel";
import { Crew } from "@/models/Crew";
import { Member, MemberRoles } from "@/models/Member";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
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
      crewId: newCrew._id, // Link channel to crew
    });

    // Create a member for the crew
    const member = await Member.create({
      userId: user._id,
      crewId: newCrew._id,
      role: MemberRoles.ADMIN,
    });

    // Push the created references into the crew document
    newCrew.channels.push(channel._id);
    newCrew.members.push(member._id);

    // Push the created reference into the user document
    user.crews.push(newCrew._id);
    user.members.push(member._id);
    user.channels.push(channel._id);

    // Save the updated crew document
    await newCrew.save();
    await user.save();

    return NextResponse.json(newCrew);
  } catch (error) {
    console.log("[CREW_CREATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
