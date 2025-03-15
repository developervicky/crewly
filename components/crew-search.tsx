"use client";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface CrewSearchProps {
  data:
    | {
        label: string;
        type: "member" | "channel";
        data: {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[];
      }[]
    | undefined;
}

const CrewSearch = ({ data }: CrewSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "member" | "channel";
  }) => {
    setOpen(false);

    if (type === "member") {
      return router.push(`/crew/${params?.crewId}/conversation/{id}`);
    }

    if (type === "channel") {
      return router.push(`/crew/${params?.crewId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-700/10 dark:hover:bg-gray-700/50 transition"
      >
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <p className="font-semibold text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition">
          Search
        </p>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          ctrl+K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for you channels and members" />
        <CommandList>
          <CommandEmpty>No Results found</CommandEmpty>
          {data?.map(({ data, label, type }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, id, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CrewSearch;
