"use client";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomToast from "./custom-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Crew name is required 👀",
  }),
  imageUrl: z.string().min(1, {
    message: "Upload your crew image 👀",
  }),
});

const EditCrewModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { crew } = data;

  const isModalOpen = isOpen && type == "editCrew";

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (crew) {
      form.setValue("name", crew.name ?? "");
      form.setValue("imageUrl", crew.imageUrl ?? "");
    }
  }, [crew, form, isOpen]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/crew/${crew?._id}`, values);

      form.reset();
      router.refresh();
      onClose();
      CustomToast({ variant: "success", message: "Crew updated" });
    } catch (error) {
      console.error(error);
      CustomToast({
        variant: "success",
        message: "Unsuccessful, reload and try again",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit your crew 🛠️
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Assemble your crew—give it a name, set an image, and make it yours!
            🫂
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endPoint="crewImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Crew name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="your crew name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCrewModal;
