" use client";
import { useSocket } from "@/components/socket-provider";
import { MessageWithMemberAndUser } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

interface ChatResponse {
  messages: MessageWithMemberAndUser[]; // Replace `any` with actual message type
  nextCursor?: string | null;
}
export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: unknown;
  }): Promise<ChatResponse> => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam ? String(pageParam) : "",
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<ChatResponse>({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage: ChatResponse) =>
        lastPage?.nextCursor ?? undefined,
      initialPageParam: undefined,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
