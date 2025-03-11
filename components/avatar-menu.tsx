"use client";
import React, { FC, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomAvatar from "./avatar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface AvatarMenuProps {
  name: string;
  email: string;
  imageUrl: string;
}

const AvatarMenu: FC<AvatarMenuProps> = ({ name, email, imageUrl }) => {
  const [signOutStatus, setSignOutStatus] = useState(false);
  const handleSignout = async () => {
    try {
      setSignOutStatus(true);
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(signOutStatus);
  return (
    <Popover>
      <PopoverTrigger>
        <CustomAvatar name={name} imageUrl={imageUrl} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex gap-3 justify-around items-center">
          <div className="flex flex-col ">
            <p className="font-semibold">{name}</p>
            <p className="text-xs font-extralight">{email}</p>
          </div>
          <Button
            disabled={signOutStatus}
            onClick={() => handleSignout()}
            className="group rounded-full"
          >
            <LogOut className=" dark:text-gray-700 transition-all group-hover:scale-110" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarMenu;
