"use client";
import { useModal } from "@/hooks/use-modal-store";
import { CrewPopulated } from "@/types";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
interface CrewHeaderProps {
  crew: CrewPopulated;
  role?: "ADMIN" | "GUEST" | "MODERATOR";
}

const CrewHeader = ({ crew, role }: CrewHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === "ADMIN";
  const isModerator = isAdmin || role === "MODERATOR";
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
          <DropdownMenuItem
            onClick={() => onOpen("invite", { crew })}
            className="px-3 py-2 group hover:text-white transition-all !cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto dark:group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editCrew", { crew })}
            className="px-3 py-2 group hover:text-white transition-all !cursor-pointer"
          >
            Crew Settings
            <Settings className="h-4 w-4 ml-auto dark:group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { crew })}
            className="px-3 py-2 group hover:text-white transition-all !cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto dark:group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 group hover:text-white transition-all !cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto dark:group-hover:text-white" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteCrew")}
            className="px-3 py-2 group text-rose-500 hover:!text-rose-700 transition-all !cursor-pointer"
          >
            Delete Crew
            <Trash className="h-4 w-4 ml-auto group-hover:text-rose-700" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveCrew")}
            className="px-3 py-2 group text-rose-500 hover:!text-rose-700 transition-all !cursor-pointer"
          >
            Leave Crew
            <LogOut className="h-4 w-4 ml-auto group-hover:text-rose-700" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CrewHeader;
