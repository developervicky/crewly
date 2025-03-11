"use client";
import React, { FC } from "react";
import ActionTooltip from "./action-tooltip";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem: FC<NavigationItemProps> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/crew/${id}`);
  };

  return (
    <ActionTooltip side="right" label={name} align="center">
      <button
        onClick={handleClick}
        className="group cursor-pointer relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.crewId !== id && "group-hover:h-[20px]",
            params?.crewId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.crewId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill priority src={imageUrl} alt={name} />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
