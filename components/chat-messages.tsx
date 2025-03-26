"use client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useChatSocket from "@/hooks/use-chat-socket";
import { IMember } from "@/models/Member";
import { MessageWithMemberAndUser } from "@/types";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { StringifiableRecord } from "query-string";
import { Fragment, useRef } from "react";
import ChatItem from "./chat-item";
import ChatWelcome from "./chat-welcome";
import { Button } from "./ui/button";

interface ChatMessagesProps {
  name: string;
  member: IMember;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: StringifiableRecord;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ addKey, updateKey, queryKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-gray-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-gray-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-gray-500" />
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              variant="link"
              className="my-4 text-xs text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </Button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.messages.map((message: MessageWithMemberAndUser) => (
              <ChatItem
                key={message._id.toString()}
                content={message.content}
                currentMember={member}
                deleted={message.deleted}
                fileUrl={message.fileUrl ?? null}
                id={message._id.toString()}
                isUpdated={message.createdAt !== message.updatedAt}
                member={message.memberId}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
