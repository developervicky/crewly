import { MemberRoles } from "@/models/Member";
import { CrewPopulated } from "@/types";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

interface CrewHeaderProps {
  crew: CrewPopulated | null;
  role?: MemberRoles | null;
}

const CrewHeader = ({ crew, role }: CrewHeaderProps) => {
  const isAdmin = role === MemberRoles.ADMIN;
  const isModerator = isAdmin || role === MemberRoles.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none !cursor-pointer"
        asChild
      >
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-gray-200 dark:border-gray-800 border-b-2 hover:bg-stone-700/10 dark:bg-stone-700/50 transition">
          {crew?.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-gray-400 space-y-[2px] ">
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 group hover:text-white transition-all !cursor-pointer">
            Invite People
            <UserPlus className="h-4 w-4 ml-auto group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 group hover:text-white transition-all !cursor-pointer">
            Crew Settings
            <Settings className="h-4 w-4 ml-auto group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 group hover:text-white transition-all !cursor-pointer">
            Manage Members
            <Users className="h-4 w-4 ml-auto group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 group hover:text-white transition-all !cursor-pointer">
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 group text-rose-500 hover:!text-rose-700 transition-all !cursor-pointer">
            Delete Crew
            <Trash className="h-4 w-4 ml-auto group-hover:text-rose-700" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="px-3 py-2 group text-rose-500 hover:!text-rose-700 transition-all !cursor-pointer">
            Leave Crew
            <LogOut className="h-4 w-4 ml-auto group-hover:text-rose-700" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CrewHeader;
