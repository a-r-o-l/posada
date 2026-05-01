import React from "react";
import PicturesClient from "./components/PicturesClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function page() {
  return (
    <div className="py-10 container mx-auto">
      <div className="flex items-center gap-2">
        <Button asChild size="default" variant="outline">
          <Link href="/store" passHref>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a la tienda
          </Link>
        </Button>
        <Tabs defaultValue="pictures" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account" asChild>
              <Link href="/store/account" passHref>
                Mi Cuenta
              </Link>
            </TabsTrigger>
            <TabsTrigger value="childrens" asChild>
              <Link href="/store/account/children" passHref>
                Mis Menores
              </Link>
            </TabsTrigger>
            <TabsTrigger value="purchases" asChild>
              <Link href="/store/account/purchases" passHref>
                Mis Compras
              </Link>
            </TabsTrigger>
            <TabsTrigger value="pictures" asChild>
              <Link href="/store/account/pictures" passHref>
                Mis Fotos
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-5">
        <PicturesClient />
      </div>
    </div>
  );
}

export default page;
