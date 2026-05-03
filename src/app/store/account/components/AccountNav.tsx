import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function AccountNav({ value }: { value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <div>
        <Button asChild variant="outline" className="text-xs p-3">
          <Link href="/store" passHref>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a la tienda
          </Link>
        </Button>
      </div>
      <Tabs defaultValue={value} className="mt-5 md:mt-0">
        <TabsList>
          <TabsTrigger value="account" asChild className="text-xs md:text-base">
            <Link href="/store/account" passHref>
              Mi Cuenta
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="childrens"
            asChild
            className="text-xs md:text-base"
          >
            <Link href="/store/account/children" passHref>
              Mis Menores
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="purchases"
            asChild
            className="text-xs md:text-base"
          >
            <Link href="/store/account/purchases" passHref>
              Mis Compras
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="pictures"
            asChild
            className="text-xs md:text-base"
          >
            <Link href="/store/account/pictures" passHref>
              Mis Fotos
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default AccountNav;
