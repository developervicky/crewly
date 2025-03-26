"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface FileUploadProps {
  onChange: (fileUrl?: string, fileName?: string) => void;
  fileUrl: string;
  fileName?: string;
  endPoint: "crewImage" | "messageFile";
}

const FileUpload: FC<FileUploadProps> = ({
  endPoint,
  onChange,
  fileName,
  fileUrl,
}) => {
  // const [fileName, setFileName] = useState("");
  const fileType = fileName?.split(".").pop();

  if (fileUrl && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          priority
          src={fileUrl}
          alt="upload_image"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 cursor-pointer rounded-full bg-rose-500 p-1 text-white shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (fileUrl && fileType === "pdf") {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-gray-400/10 p-2">
        <FileIcon className="h-10 w-10 fill-gray-200 stroke-gray-600" />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
          {fileName}
        </a>
        <button
          onClick={() => onChange("")}
          className="absolute -top-3 -right-3 cursor-pointer rounded-full bg-rose-500 p-1 text-white shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        // console.log(res);
        // setFileName(res[0].name);
        onChange(res[0].ufsUrl, res[0].name);
      }}
      onUploadError={(err: Error) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
