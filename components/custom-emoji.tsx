import { Smile } from "lucide-react";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface CustomEmojiProps {
  onChange: (value: string) => void;
}
const CustomEmoji = ({ onChange }: CustomEmojiProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="left"
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16 w-fit px-0"
      >
        <EmojiPicker
          className="h-[400px]"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => {
            onChange(emoji.native);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};

export default CustomEmoji;
