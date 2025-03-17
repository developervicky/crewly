"use client";

import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { IChannel } from "@/models/Channel";
import { CrewPopulated, MemberRoles } from "@/types";
import { Edit, Lock, Trash } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import ActionTooltip from "./action-tooltip";
import { CustomIcon } from "./icon-map";

interface CrewChannelProps {
  channel: IChannel;
  crew: CrewPopulated;
  role?: MemberRoles;
}
const CrewChannel = ({ channel, crew, role }: CrewChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();

  const onClick = () => {
    redirect(`/crew/${params.crewId}/channel/${channel._id}`);
  };

  const onAction = (e: React.MouseEvent, type: ModalType) => {
    e.stopPropagation();

    onOpen(type, { channel, crew });
  };

  return (
    <div>
      <button
        onClick={onClick}
        className={cn(
          "cursor-pointer group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-700/10 dark:hover:bg-gray-700/50 transition mb-1",
          params?.channelId === channel._id && "bg-gray-700/20 dark:bg-gray-700"
        )}
      >
        {CustomIcon(
          channel.type,
          "flex-shrink text-gray-500 dark:text-gray-400"
        )}
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300 transition",
            params?.channelId === channel._id &&
              "text-primary dark:text-gray-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel?.name !== "general" && role !== MemberRoles.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit
                onClick={(e) => onAction(e, "editChannel")}
                className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={(e) => onAction(e, "deleteChannel")}
                className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-500 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel?.name === "general" && (
          <Lock className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default CrewChannel;
