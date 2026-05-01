import { nameParser } from "@/lib/utilsFunctions";
import Image from "next/image";
import React from "react";

const data = {
  opened: {
    red: "/ui/store/redopenfolder.png",
    yellow: "/ui/store/yellowopenfolder.png",
    green: "/ui/store/greenopenfolder.png",
    blue: "/ui/store/blueopenfolder.png",
  },
  closed: {
    red: "/ui/store/redclosefolder.png",
    yellow: "/ui/store/yellowclosefolder.png",
    green: "/ui/store/greenclosefolder.png",
    blue: "/ui/store/blueclosefolder.png",
  },
};

function DynamicFolder({
  color,
  title,
  isOpened,
  width = 150,
  height = 150,
  onClick,
  description,
}: {
  color: "red" | "yellow" | "green" | "blue";
  title: string;
  isOpened: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
  description?: string;
}) {
  const field = isOpened ? data.opened[color] : data.closed[color];

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Image src={field} alt={title} width={width} height={height} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-[80%] px-2">
          <h1 className="text-center font-black lg:text-base line-clamp-2 text-xs">
            {nameParser(title)}
          </h1>
          {/* <p className="text-center font-thin text-base text-foreground line-clamp-2 leading-4">
            {description}
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default DynamicFolder;
