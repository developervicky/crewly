import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface CustomAvatarProps {
  name?: string;
  imageUrl?: string;
  className?: string;
}

const CustomAvatar: FC<CustomAvatarProps> = ({ name, imageUrl, className }) => {
  // console.log(imageUrl);
  return (
    <Avatar className={cn("hover:cursor-pointer", className)}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
