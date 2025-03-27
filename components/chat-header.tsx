import { Hash } from "lucide-react";
import CustomAvatar from "./avatar";
import MobileToggle from "./mobile-toggle";
import SocketIndicator from "./socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
  crewId: string;
  name: string;
  type: "channel" | "member";
  image?: string;
}

const ChatHeader = ({ crewId, name, type, image }: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-gray-200 px-3 font-semibold dark:border-gray-700">
      <MobileToggle crewId={crewId} />
      {type === "channel" && (
        <Hash className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
      {type === "member" && (
        <CustomAvatar imageUrl={image} name={name} className="mr-2" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "member" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
