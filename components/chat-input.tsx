"use client";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus, Rocket } from "lucide-react";
import type { StringifiableRecord } from "query-string";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

interface ChatInputProps {
  apiUrl: string;
  query: StringifiableRecord;
  name: string;
  type: "channel" | "member";
}

const formSchema = z.object({ content: z.string().min(1) });

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // console.log(isLoading);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl, query });

      await axios.post(url, values);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-gray-500 p-1 transition hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    autoComplete="off"
                    className="border-0 border-none bg-gray-200/90 px-14 py-6 text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-700/75 dark:text-gray-200"
                    placeholder={`message ${
                      type === "member" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="group absolute top-[22px] right-6 flex items-center">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="cursor-pointer rounded-md bg-gray-300 px-4 py-1.5 transition-all group-hover:bg-emerald-300 disabled:cursor-wait dark:bg-gray-600/80 dark:group-hover:bg-emerald-300/20"
                    >
                      <Rocket className="text-gray-600 transition-all group-hover:scale-110 group-hover:text-emerald-800 dark:text-gray-300 dark:group-hover:text-emerald-500" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
