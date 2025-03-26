import { auth } from "@/auth";
import { User } from "@/models/User";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { connectDB } from "./mongoose";

const currentUserPages = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponseServerIo;
}) => {
  const session = await auth(req, res);
  if (!session?.user) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({ _id: session.user.id });

  return user;
};

export default currentUserPages;
