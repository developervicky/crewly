"use client";

import { useModal } from "@/hooks/use-modal-store";
import { ChannelTypes, CrewPopulated, MemberRoles } from "@/types";
import { Plus, Settings } from "lucide-react";
import ActionTooltip from "./action-tooltip";

interface CrewSectionProps {
  label: string;
  role?: MemberRoles;
  sectionType: "channels" | "members";
  channelType?: ChannelTypes;
  crew?: CrewPopulated;
}
const CrewSection = ({
  label,
  role,
  sectionType,
  channelType,
  crew,
}: CrewSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {role !== MemberRoles.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="cursor-pointer text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRoles.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { crew })}
            className="cursor-pointer text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default CrewSection;
