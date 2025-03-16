import { cn } from "@/lib/utils";
import { ChannelTypes, MemberRoles } from "@/types";
import { BadgeCheck, Crown, Hash, Mic, Video } from "lucide-react";
import { JSX } from "react";

type IconType = ChannelTypes | MemberRoles;

export const CustomIcon = (type: IconType, className?: string) => {

  const icons: Record<IconType, JSX.Element | null> = {
    // channel icons
    [ChannelTypes.TEXT]: <Hash className={cn("h-4 w-4", className)} />,
    [ChannelTypes.AUDIO]: <Mic className={cn("h-4 w-4", className)} />,
    [ChannelTypes.VIDEO]: <Video className={cn("h-4 w-4", className)} />,

    // member role icons
    [MemberRoles.GUEST]: null,
    [MemberRoles.ADMIN]: (
      <Crown className={cn("h-4 w-4 text-amber-500", className)} />
    ),
    [MemberRoles.MODERATOR]: (
      <BadgeCheck className={cn("h-4 w-4 text-emerald-600", className)} />
    ),
  };

  return icons[type] || null;
};
 
