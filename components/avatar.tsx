import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC } from "react";

interface CustomAvatarProps {
  name?: string;
  imageUrl?: string;
}

const CustomAvatar: FC<CustomAvatarProps> = ({ name, imageUrl }) => {
  // console.log(imageUrl);
  return (
    <Avatar className="hover:cursor-pointer">
      <AvatarImage src={imageUrl}  />
      <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
