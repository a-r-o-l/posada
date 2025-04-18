import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IFile } from "@/models/File";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SelectFileTableRow from "./SelectFileTableRow";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/zustand/useCartStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/models/Product";

interface IProductWithQuantity extends IProduct {
  quantity: number;
}

function SelectFileModal({
  file,
  open,
  onClose,
  products,
}: {
  file: IFile | null;
  open: boolean;
  onClose: () => void;
  products: IProduct[];
}) {
  const addProduct = useCartStore((state) => state.addProduct);
  const [data, setData] = useState([] as IProductWithQuantity[]);

  useEffect(() => {
    if (!!products.length) {
      const prodsWithQuantity = products.map((prod) => {
        return { ...prod, quantity: 0 };
      });
      setData(prodsWithQuantity);
    }
  }, [products, open]);

  const handlePlus = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleMinus = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <Drawer open={open} onOpenChange={onClose} dismissible={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl">
            {file?.title}
          </DrawerTitle>
          <DrawerDescription className="text-center">
            Lista de productos disponibles para el archivo
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col w-full items-center gap-5 justify-center max-h-[600px] md:max-h-[700px] overflow-y-auto pt-80 md:flex-row md:pt-0 py-10">
          <div className="w-80 h-80 flex justify-center">
            {file?.imageUrl && (
              <AspectRatio ratio={1 / 1} className="w-full rounded-xl">
                <Image
                  src={file?.imageUrl}
                  alt={file?.title}
                  layout="fill"
                  objectFit="contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            )}
          </div>
          <div className="pb-10">
            <Table className="max-w-[450px]">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead align="right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <SelectFileTableRow
                    item={item}
                    key={item._id}
                    onPlus={() => handlePlus(item._id)}
                    onMinus={() => handleMinus(item._id)}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-bold text-lg">
                    Total
                  </TableCell>
                  <TableCell align="right">
                    <Badge className="min-w-20 justify-center">
                      ${" "}
                      {data
                        .map((item) => item.price * item.quantity)
                        .reduce((acc, curr) => acc + curr, 0)
                        .toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="flex justify-evenly mt-10">
              <Button
                className="w-40"
                onClick={() => {
                  if (!file) {
                    return toast.error("No se ha seleccionado un archivo");
                  }
                  const selectedItems = data
                    .filter((i) => i.quantity > 0)
                    .map((it) => {
                      return {
                        id: `${it._id}${file._id}`,
                        fileId: file?._id,
                        productId: it._id,
                        fileTitle: file?.title,
                        fileImageUrl: file.imageUrl || "",
                        quantity: it.quantity,
                        name: it.name,
                        price: it.price,
                        total: it.price * it.quantity,
                      };
                    });
                  selectedItems.forEach((item) => addProduct(item));
                  onClose();
                  toast.success("Producto agregado al carrito");
                }}
              >
                Agregar
              </Button>
              <Button className="w-40" onClick={onClose} variant="outline">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SelectFileModal;
