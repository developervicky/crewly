import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomAvatarProps {
  name: string;
  imageUrl: string;
}

const CustomAvatar: FC<CustomAvatarProps> = ({ name, imageUrl }) => {
  return (
    <Avatar className="hover:cursor-pointer">
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
