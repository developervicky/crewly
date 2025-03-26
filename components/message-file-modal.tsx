/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
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
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import CustomToast from "./custom-toast";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Upload any file 👀",
  }),
  fileName: z.string().min(1),
});

const MessageFileModal = () => {
  const { data, isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type == "messageFile";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
      fileName: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const { apiUrl, query } = data;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl || "", query });
      await axios.post(url, {
        fileName: values.fileName,
        fileUrl: values.fileUrl,
      });

      form.reset();
      router.refresh();
      handleClose();
      CustomToast({ variant: "success", message: "Your file uploaded" });
    } catch (error) {
      console.error(error);
      CustomToast({
        variant: "success",
        message: "Unsuccessful, reload and try again",
      });
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Upload Image/Pdf 🚀
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a photo or PDF & let the conversation flow! 💬
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint="messageFile"
                            fileUrl={field.value}
                            fileName={form.watch("fileName")}
                            onChange={(url, name) => {
                              form.setValue("fileUrl", url ?? ""),
                              form.setValue("fileName", name ?? "")
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading}>Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
