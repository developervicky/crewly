"use client";

import { Video, VideoOff } from "lucide-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import ActionTooltip from "./action-tooltip";

const ChatVideoButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    redirect(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="mr-4 transition hover:opacity-75">
        <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
