"use client";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import ActionTooltip from "./action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip label="Create a crew" side="right" align="center">
        <div className="group flex items-center">
          <Button
            onClick={() => {
              onOpen("createCrew");
            }}
            variant="outline"
            className="h-[48px] border-3 w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden"
          >
            <Plus
              className="dark:group-hover:text-white group-hover:scale-125 transition text-gray-500"
              size={25}
            />
          </Button>
        </div>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
