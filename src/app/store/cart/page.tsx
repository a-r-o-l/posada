import React from "react";
import CartItemsList from "./components/CartItemsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <div>
        <Link href="/store" passHref>
          <Button variant="ghost">
            <ArrowLeft />
            <span className="ml-2">Volver a la tienda</span>
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold pl-12">Compra</h1>
      <div className="mt-10">
        <CartItemsList />
      </div>
    </div>
  );
}

export default page;
