import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChildrensClientSide from "./components/ChildrensClientSide";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <div className="flex items-center gap-2">
        <Button asChild size="default" variant="outline">
          <Link href="/sstore" passHref>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a la tienda
          </Link>
        </Button>
        <Tabs defaultValue="childrens" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account" asChild>
              <Link href="/sstore/account" passHref>
                Mi Cuenta
              </Link>
            </TabsTrigger>
            <TabsTrigger value="childrens" asChild>
              <Link href="/sstore/account/children" passHref>
                Mis Menores
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-5">
        <ChildrensClientSide />
      </div>
    </div>
  );
}

export default page;
