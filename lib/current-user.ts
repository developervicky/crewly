import { auth } from "@/auth";
import { connectDB } from "./mongoose";
import { User } from "@/models/User";

const CurrentUser = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({ _id: session.user.id });

  return user;
};

export default CurrentUser;
