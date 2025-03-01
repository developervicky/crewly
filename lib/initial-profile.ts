import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "./mongoose";
import { User } from "@/models/User";

const initialProfile = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findOne({ _id: session.user.id });

  return user;
};

export default initialProfile;
