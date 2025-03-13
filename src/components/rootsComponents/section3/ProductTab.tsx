import React from "react";

function ProductTab({
  isSelected,
  title,
  setIsSelected,
}: {
  title: string;
  isSelected: boolean;
  setIsSelected: (it: any) => void;
}) {
  if (isSelected) {
    return (
      <div
        className="h-10 bg-[#F9AE48] border-2 rounded-full flex justify-center items-center shadow-xl cursor-pointer lg:h-14"
        onClick={() => setIsSelected(title)}
      >
        <p className="font-black text-center text-xs md:text-sm lg:text-base">
          {title}
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-10 border-[#F9AE48] border-2 rounded-full flex justify-center items-center cursor-pointer lg:h-14"
      onClick={() => setIsSelected(title)}
    >
      <p className="font-black text-center text-xs md:text-sm lg:text-base">
        {title}
      </p>
    </div>
  );
}

export default ProductTab;
