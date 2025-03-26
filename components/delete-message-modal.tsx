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
import qs from "query-string";
import { useState } from "react";
import CustomToast from "./custom-toast";
import { Button } from "./ui/button";

const DeleteMessageModal = () => {
  const { isOpen, type, onClose, data } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type == "deleteMessage";

  const { apiUrl, query } = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);

      onClose();
      CustomToast({ variant: "success", message: "Message deleted 🏃‍♂️" });
    } catch (error) {
      console.log(error);
      CustomToast({
        variant: "error",
        message: "The server resists deletion… 🔗😨",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Message 🙅🛑
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Once deleted, your message cannot be restored. Are you certain?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
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

export default DeleteMessageModal;
