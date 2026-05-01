"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileFullDetails } from "@/supabase/models/file";
import Image from "next/image";
import React from "react";

function FileComponent({
  file,
  onShowImage,
}: {
  file: FileFullDetails;
  onShowImage: (file: FileFullDetails) => void;
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
          src={file?.image_url || "/placeholderimg.jpg"}
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
