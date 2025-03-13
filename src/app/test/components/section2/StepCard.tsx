import { cn } from "@/lib/utils";
import React from "react";

function StepCard({
  item,
}: {
  item: {
    classname?: string;
    number: number;
    title: string;
    content: string;
    circleColor: string;
    titleColor: string;
  };
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl bg-[#E4E6F2] p-4 shadow-xl w-44 h-40 sm:h-44 md:h-56 md:w-96 relative",
        item?.classname
      )}
    >
      <div className="w-full flex items-start">
        <div className="w-4/5">
          <p
            className={cn(
              "font-bold text-base md:text-3xl leading-none",
              item?.titleColor
            )}
          >
            {item?.title}
          </p>
        </div>
        <div
          className={cn(
            "rounded-full flex justify-center items-center absolute right-2 top-2 w-8 h-8 md:w-14 md:h-14",
            item?.circleColor
          )}
        >
          <p className="font-thin text-xl sm:text-2xl md:text-5xl">
            {item?.number}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs sm:text-sm md:text-lg">{item?.content}</p>
      </div>
    </div>
  );
}

export default StepCard;
