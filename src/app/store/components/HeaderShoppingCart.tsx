"use client";
import { useCartStore } from "@/zustand/useCartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

function HeaderShoppingCart() {
  const cartItems = useCartStore((state) => state.products);

  return (
    <div className="relative">
      <Link href={"/store/cart"}>
        <div className="bg-[#139FDC] rounded-full p-3 flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-white hover:text-gray-300" />
        </div>
      </Link>
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems.length > 9 ? "9+" : cartItems.length}
        </span>
      )}
    </div>
  );
}

export default HeaderShoppingCart;
