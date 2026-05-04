"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { FileFullDetails } from "@/supabase/models/file";
import Image from "next/image";
import React, { useState } from "react";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

function FileComponent({
  file,
  onShowImage,
}: {
  file: FileFullDetails;
  onShowImage: (file: FileFullDetails) => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div
      className="w-40 flex justify-center items-center rounded-md hover:opacity-70 cursor-pointer"
      onClick={() => {
        onShowImage(file);
      }}
    >
      <AspectRatio ratio={1 / 1} className="w-full rounded-xl relative">
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
        )}
        <Image
          src={file?.image_url || "/placeholderimg.jpg"}
          alt={file?.title}
          layout="fill"
          objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          onLoad={() => setIsLoading(false)}
          className={
            isLoading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-300"
          }
        />
      </AspectRatio>
    </div>
  );
}

export default FileComponent;
