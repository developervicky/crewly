"use client";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import {
  BadgeCheck,
  Check,
  Loader2,
  MoreVertical,
  ShieldQuestion,
  ShieldUser,
  UserMinus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import CustomAvatar from "./avatar";
import CustomToast from "./custom-toast";
import { CustomIcon } from "./icon-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

const MembersModal = () => {
  const [loadingId, setLoadingId] = useState("");
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const { crew } = data;

  const router = useRouter();

  const isModalOpen = isOpen && type == "members";

  const onKick = async (memberId: string, memberUserId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/member/${memberId}`,
        query: {
          crewId: crew?._id.toString(),
          memberUserId,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { crew: response.data });
      CustomToast({ variant: "success", message: "User kicked out" });
    } catch (error) {
      console.log(error);
      CustomToast({
        variant: "error",
        message: "Can't kick out, reload and try again",
      });
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (
    memberId: string,
    role: "GUEST" | "MODERATOR" | "ADMIN"
  ) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/member/${memberId}`,
        query: {
          crewId: crew?._id.toString(),
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { crew: response.data });
      CustomToast({
        variant: "success",
        message: `${role} mode: ACTIVATED!`,
      });
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.response) {
        CustomToast({
          variant: "error",
          message: `${error.response.data}, reload and try again`,
        });
      } else {
        CustomToast({
          variant: "error",
          message: "An unexpected error occurred, reload and try again",
        });
      }
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members 🛠️
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {crew?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {crew?.members?.map((member) => {
            // console.log(member.userId.image);
            return (
              <div
                key={member._id.toString()}
                className="flex items-center gap-x-2 mb-6"
              >
                <CustomAvatar
                  imageUrl={member?.userId?.image ?? undefined}
                  name={member?.userId?.name ?? undefined}
                />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center">
                    {member?.userId?.name}
                    {CustomIcon(member?.role, "ml-1")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {member?.userId?.email}
                  </div>
                </div>
                {crew?.userId !== member?.userId._id &&
                  loadingId !== member?._id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="!cursor-pointer">
                          <MoreVertical className="h- w-4 text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center !cursor-pointer">
                              <ShieldQuestion className="h-4 w-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  disabled={member.role === "GUEST"}
                                  onClick={() =>
                                    onRoleChange(member._id.toString(), "GUEST")
                                  }
                                  className="!cursor-pointer"
                                >
                                  <ShieldUser className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={member.role === "MODERATOR"}
                                  onClick={() =>
                                    onRoleChange(
                                      member._id.toString(),
                                      "MODERATOR"
                                    )
                                  }
                                  className="!cursor-pointer"
                                >
                                  <BadgeCheck className="h-4 w-4 mr-2 text-emerald-600" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto " />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onKick(
                                member._id.toString(),
                                member.userId._id.toString()
                              )
                            }
                            className="text-rose-500 group hover:!text-rose-700 !cursor-pointer"
                          >
                            <UserMinus className="h-4 w-4 mr-2 text-rose-500 group-hover:text-rose-700" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member._id && (
                  <Loader2 className="h-4 w-4 animate-spin ml-auto text-gray-500" />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
