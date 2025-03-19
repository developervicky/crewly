import { Hash } from "lucide-react";
import MobileToggle from "./mobile-toggle";

interface ChatHeaderProps {
  crewId: string;
  name: string;
  type: "channel" | "member";
  image?: string;
}

const ChatHeader = ({ crewId, name, type, image }: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-gray-200 dark:border-gray-700 border-b-2">
      <MobileToggle crewId={crewId} />
      {type === "channel" && (
        <Hash className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
