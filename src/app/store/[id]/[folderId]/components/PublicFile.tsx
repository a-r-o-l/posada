import { AspectRatio } from "@/components/ui/aspect-ratio";
import { IFile } from "@/models/File";
import Image from "next/image";
import React from "react";

function PublicFile({
  file,
  onClick,
}: {
  file: IFile;
  onClick: (file: IFile) => void;
}) {
  return (
    <div
      key={file._id}
      className="w-32 lg:w-40 flex justify-center items-center rounded-md opacity-70 hover:opacity-100 cursor-pointer"
      onClick={() => {
        onClick(file);
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

export default PublicFile;
