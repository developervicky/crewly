import currentUser from "@/lib/current-user";
import { Crew } from "@/models/Crew";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ crewId: string }> } 
) {
  try {
    const user = await currentUser();
    const {crewId} = await params; 
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
