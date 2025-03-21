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
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CustomToast from "./custom-toast";
import { Button } from "./ui/button";

const DeleteCrewModal = () => {
  const { isOpen, type, onClose } = useModal();

  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type == "deleteCrew";

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/crew/${params.crewId}`);

      onClose();
      router.refresh();
      router.push("/");
      CustomToast({ variant: "success", message: "Crew deleted 🏃‍♂️" });
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
            Delete Crew 🙅
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Once deleted, your crew cannot be restored. Are you certain? 🛑
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

export default DeleteCrewModal;
