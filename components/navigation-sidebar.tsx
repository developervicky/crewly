import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { redirect } from "next/navigation";

import { Member } from "@/models/Member";
import AvatarMenu from "./avatar-menu";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "./ui/mode-toggle";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const NavigationSidebar = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // console.log(user);

  await connectDB();

  const memberCrews = await Member.find({ userId: user._id })
    .populate({
      path: "crewId",
    })
    .lean();

  const crews = memberCrews.map((crew) => crew.crewId);

  // console.log(crews);

  return (
    <div className="space-y-4 flex flex-col bg-[#F2F3F5] items-center md:rounded-xl h-full md:h-[95%] text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="!h-[2px] bg-gray-300 dark:bg-gray-700 rounded-md !w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {crews.map((crew) => {
          const id = crew._id.toString();
          return (
            <div key={id} className="mb-4">
              <NavigationItem
                id={id}
                imageUrl={crew.imageUrl}
                name={crew.name}
              />
            </div>
          );
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <AvatarMenu name={user.name} email={user.email} imageUrl={user.image} />
      </div>
    </div>
  );
};

export default NavigationSidebar;
