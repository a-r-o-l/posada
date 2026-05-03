"use client";
import { Avatar } from "@/components/ui/avatar";
import { useCartStore } from "@/zustand/useCartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

function HeaderShoppingCart() {
  const cartItems = useCartStore((state) => state.products);

  return (
    <div className="relative">
      {/* <Link href={"/store/cart"}>
        <div className="bg-[#139FDC] rounded-full p-3 flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-white hover:text-gray-300" />
        </div>
      </Link> */}
      <Link href={"/store/cart"}>
        <Avatar className="w-10 h-10 md:w-12 md:h-12 cursor-pointer hover:ring-2 hover:ring-[#139FDC] transition-all duration-200 border-2 border-[#139FDC] justify-center items-center bg-[#139FDC]">
          <ShoppingCart className="h-6 w-6 bg-[#139FDC]" />
        </Avatar>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length > 9 ? "9+" : cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );
}

export default HeaderShoppingCart;
