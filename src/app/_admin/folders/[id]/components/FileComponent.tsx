"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { IFile } from "@/models/File";
import Image from "next/image";
import React from "react";

function FileComponent({
  file,
  onShowImage,
}: {
  file: IFile;
  onShowImage: (file: IFile) => void;
}) {
  return (
    <div
      className="w-40 flex justify-center items-center rounded-md hover:opacity-70 cursor-pointer"
      onClick={() => {
        onShowImage(file);
      }}
    >
      <AspectRatio ratio={1 / 1} className="w-full rounded-xl">
        <Image
          src={file?.imageUrl || "/placeholderimg.jpg"}
          alt={file?.title}
          layout="fill"
          objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </AspectRatio>
    </div>
  );
}

export default FileComponent;
