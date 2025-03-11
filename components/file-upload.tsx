"use client ";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "crewImage" | "messageFile";
}

const FileUpload: FC<FileUploadProps> = ({ endPoint, onChange, value }) => {
  if (value) {
    return (
      <div className="relative h-20 w-20">
        <Image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          src={value}
          alt="upload_image"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 cursor-pointer text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
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
        // console.log(res[0].ufsUrl);
        onChange(res[0].ufsUrl);
      }}
      onUploadError={(err: Error) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
