"use client";
import { cn } from "@/lib/utils";
import { IMember } from "@/models/Member";
import { IUser } from "@/models/User";
import { CrewPopulated } from "@/types";
import { redirect, useParams } from "next/navigation";
import CustomAvatar from "./avatar";
import { CustomIcon } from "./icon-map";

interface CrewMemberProps {
  member: IMember & { userId: IUser };
  crew?: CrewPopulated;
}
const CrewMember = ({ member }: CrewMemberProps) => {
  const params = useParams();

  const onClick = () => {
    redirect(`/crew/${params?.crewId}/convo/${member._id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md p-2 transition hover:bg-gray-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member._id && "bg-gray-700/20 dark:bg-gray-700",
      )}
    >
      <CustomAvatar
        imageUrl={member?.userId?.image ?? ""}
        name={member?.userId?.name ?? ""}
      />
      <p
        className={cn(
          "text-sm font-semibold break-words text-gray-500 transition group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300",
          params?.memberId === member?._id &&
            "text-primary dark:text-gray-200 dark:group-hover:text-white",
        )}
      >
        {member?.userId?.name}
      </p>
      {CustomIcon(member.role, "ml-2")}
    </button>
  );
};

export default CrewMember;
