"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import CustomToast from "./custom-toast";
import { Button } from "./ui/button";

const DeleteChannelModal = () => {
  const { isOpen, type, onClose, data } = useModal();

  const router = useRouter();

  const { channel, crew } = data;

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type == "deleteChannel";

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?._id}`,
        query: {
          crewId: crew?._id.toString(),
        },
      });

      await axios.delete(url);

      onClose();
      router.push(`/crew/${crew?._id}`);
      router.refresh();
      CustomToast({ variant: "success", message: "Channel deleted 🏃‍♂️" });
    } catch (error) {
      console.log(error);
      CustomToast({
        variant: "error",
        message: "The server resists deletion… 'You belong here.' 🔗😨",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel 🙅🛑
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Once deleted, your channel{" "}
            <span className="px-1 py-0.5 bg-gray-500/30 rounded-md">
              # {channel?.name}
            </span>{" "}
            cannot be restored. Are you certain?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={() => onDelete()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
