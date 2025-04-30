import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/zustand/useCartStore";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

function SmallCartItemsTable({ total }: { total: number }) {
  const removeOne = useCartStore((state) => state.removeOne);
  const addOne = useCartStore((state) => state.addOne);
  const cartItems = useCartStore((state) => state.products);

  return (
    <div className="overflow-y-auto h-[400px] flex lg:hidden w-full">
      <Table className="relative">
        <TableHeader className="">
          <TableRow className="w-full sticky top-[-2px] bg-gray-100 z-50 border-0">
            <TableHead className="text-xs pl-2">Archivo</TableHead>
            <TableHead className="text-xs">Producto</TableHead>
            <TableHead className="text-xs">Precio</TableHead>
            <TableHead className="text-xs text-left">Cant.</TableHead>
            <TableHead className="text-xs">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!cartItems?.length ? (
            cartItems.map((item) => (
              <TableRow key={item.id} className="w-full">
                <TableCell align="left" className="pl-2">
                  <div className="w-20 h-20 rounded-xl border-4 flex justify-start my-2">
                    <AspectRatio ratio={21 / 9}>
                      <Image
                        src={item?.fileImageUrl || "/placeholderimg.jpg"}
                        alt={item?.fileTitle}
                        layout="fill"
                        objectFit="contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </AspectRatio>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{item.name}</TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  $ {item.price}
                </TableCell>
                <TableCell className="text-xs">
                  <div className="flex justify-start items-center gap-3">
                    <Button
                      size="icon"
                      className="rounded-full p-0  bg-red-300 text-black hover:bg-red-600 hover:text-white w-8 h-8"
                      variant="outline"
                      onClick={() => removeOne(item.id)}
                    >
                      <Minus />
                    </Button>
                    <p className="text-base">{item.quantity}</p>
                    <Button
                      size="icon"
                      className="rounded-full p-0  bg-green-100 text-black hover:bg-green-500 hover:text-white w-8 h-8"
                      variant="outline"
                      onClick={() => addOne(item.id)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-xs pr-2">$ {item.total}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-60">
              <TableCell
                colSpan={5}
                align="center"
                className="text-muted-foreground"
              >
                No hay productos en el carro.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="sticky bottom-[-3px] bg-gray-100 z-50">
          <TableRow>
            <TableCell colSpan={3} align="left" className="font-bold pl-6">
              Monto total
            </TableCell>
            <TableCell align="right" colSpan={2} className="font-bold text-xs">
              <div className="justify-end h-10 text-xs flex items-center">
                <Badge
                  className="h-8 min-w-20 bg-blue-500"
                  onClick={() => console.log(cartItems)}
                >
                  ${" "}
                  {total.toLocaleString("es-ES", {
                    minimumFractionDigits: 0,
                  })}
                </Badge>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default SmallCartItemsTable;
