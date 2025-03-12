import currentUser from "@/lib/current-user";
import { connectDB } from "@/lib/mongoose";
import { Crew } from "@/models/Crew";
import { redirect } from "next/navigation";

import React from "react";
import NavigationAction from "./navigation-action";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "./ui/mode-toggle";
import AvatarMenu from "./avatar-menu";

const NavigationSidebar = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // console.log(user);

  await connectDB();

  const crews = await Crew.find({ userId: user._id });

  // console.log(crews);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
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
