"use client";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { IMember } from "@/models/Member";
import { IUser } from "@/models/User";
import { MemberRoles } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Edit, FileIcon, Trash } from "lucide-react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import qs, { StringifiableRecord } from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ActionTooltip from "./action-tooltip";
import CustomAvatar from "./avatar";
import { CustomIcon } from "./icon-map";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

interface ChatItemProps {
  id: string;
  content: string;
  member: IMember & { userId: IUser };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: IMember;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: StringifiableRecord;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timeStamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();

  const onMemberClick = () => {
    if (member._id.toString() === currentMember._id.toString()) {
      return;
    }

    redirect(`/crew/${params?.crewId}/convo/${member._id} `);
  };

  const { onOpen } = useModal();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fileType = fileUrl && content?.split(".").pop();

  const isAdmin = currentMember.role === MemberRoles.ADMIN;
  const isModerator = currentMember.role === MemberRoles.MODERATOR;
  const isOwner = currentMember._id === member._id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          onClick={onMemberClick}
          className="cursor-pointer transition hover:drop-shadow-md"
        >
          <CustomAvatar
            imageUrl={member?.userId?.image ?? undefined}
            name={member?.userId?.name ?? undefined}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="cursor-pointer text-sm font-semibold hover:underline"
              >
                {member.userId.name}
              </p>
              <ActionTooltip label={member.role}>
                {CustomIcon(member.role, "ml-2")}
              </ActionTooltip>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative mt-2 flex items-center rounded-md bg-gray-400/10 p-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-x-2 text-sm text-gray-500 hover:underline dark:text-gray-400"
              >
                <FileIcon className="h-10 w-10 fill-gray-200 stroke-gray-600" />
                {content}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-gray-600 dark:text-gray-300",
                deleted &&
                  "mt-1 text-xs text-gray-500 italic dark:text-gray-400",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-gray-500 dark:text-gray-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-gray-200/10 p-2 text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-700/75 dark:text-gray-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="default">
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-gray-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-gray-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(isEditing ? false : true)}
                className="ml-auto h-4 w-4 cursor-pointer text-gray-500 transition hover:text-gray-600 dark:hover:text-gray-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-gray-500 transition hover:text-rose-500"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
