import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MyAccountClientSide from "./components/MyAccountClientSide";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <div className="flex">
        <Link href="/store" passHref>
          <Button variant="secondary" className="ml-5 lg:ml-0">
            <ArrowLeft />
            <span className="ml-2">Volver a la tienda</span>
          </Button>
        </Link>
      </div>
      <div className="mt-10">
        <MyAccountClientSide />
      </div>
    </div>
  );
}

export default page;
