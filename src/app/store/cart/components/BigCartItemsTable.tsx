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

function BigCartItemsTable({ total }: { total: number }) {
  const removeOne = useCartStore((state) => state.removeOne);
  const addOne = useCartStore((state) => state.addOne);
  const cartItems = useCartStore((state) => state.products);

  return (
    <div className="h-[400px] hidden lg:flex">
      <Table>
        <TableHeader className="sticky top-0 bg-gray-100 z-50">
          <TableRow>
            <TableHead className="pl-6 w-48">Archivo</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-center">Cant.</TableHead>
            <TableHead className="text-right pr-6">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!cartItems?.length ? (
            cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="left" className="pl-6">
                  <div className="w-32 h-32 rounded-xl border-4 flex justify-start my-2">
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
                <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                  {item.name}
                </TableCell>
                <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                  $ {item.price}
                </TableCell>
                <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                  <div className="flex justify-center items-center gap-10">
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
                <TableCell
                  className="min-w-14 whitespace-nowrap overflow-ellipsis pr-6"
                  align="right"
                >
                  $ {item.total}
                </TableCell>
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
        <TableFooter className="sticky bottom-0 bg-gray-100 z-50">
          <TableRow>
            <TableCell colSpan={3} align="left" className="font-bold pl-6">
              Monto total
            </TableCell>
            <TableCell
              align="right"
              colSpan={2}
              className="font-bold text-lg pr-6"
            >
              <Badge
                className="min-w-40 justify-center h-12 text-lg bg-blue-500"
                onClick={() => console.log(cartItems)}
              >
                ${" "}
                {total.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}
              </Badge>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default BigCartItemsTable;
