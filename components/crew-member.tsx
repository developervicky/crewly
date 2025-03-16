"use client";
import { cn } from "@/lib/utils";
import { IMember } from "@/models/Member";
import { IUser } from "@/models/User";
import { CrewPopulated } from "@/types";
import { useParams } from "next/navigation";
import CustomAvatar from "./avatar";
import { CustomIcon } from "./icon-map";

interface CrewMemberProps {
  member: IMember & { userId: IUser };
  crew?: CrewPopulated;
}
const CrewMember = ({ member }: CrewMemberProps) => {
  const params = useParams();

  return (
    <button
      className={cn(
        "group cursor-pointer p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member._id && "bg-gray-700/20 dark:bg-gray-700"
      )}
    >
      <CustomAvatar
        imageUrl={member?.userId?.image ?? ""}
        name={member?.userId?.name ?? ""}
      />
      <p
        className={cn(
          "font-semibold text-sm break-words text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300 transition",
          params?.memberId === member?._id &&
            "text-primary dark:text-gray-200 dark:group-hover:text-white"
        )}
      >
        {member?.userId?.name}
      </p>
      {CustomIcon(member.role, "ml-2")}
    </button>
  );
};

export default CrewMember;
