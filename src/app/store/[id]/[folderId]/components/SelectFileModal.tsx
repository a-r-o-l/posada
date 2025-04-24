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

  const addHandler = () => {
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
    if (!!selectedItems.length) {
      toast.success("Producto agregado al carrito");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose} dismissible={false}>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl">
            {file?.title}
          </DrawerTitle>
          <DrawerDescription className="text-center">
            Lista de productos disponibles para el archivo
          </DrawerDescription>
        </DrawerHeader>
        <div className="h-full hidden flex-row w-full gap-5 justify-center overflow-y-auto lg:flex">
          <div className="h-[500px] flex items-center justify-center">
            <div className="w-96 h-96 flex justify-center">
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
          </div>
          <div className="pb-10">
            <Table className="max-w-[450px]">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead align="center" className="text-center">
                    Cantidad
                  </TableHead>
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
                <TableRow className="bg-gray-100">
                  <TableCell
                    colSpan={3}
                    className="font-bold text-lg px-5 py-5"
                  >
                    Total
                  </TableCell>
                  <TableCell align="right" className="py-5">
                    <Badge className="min-w-28 justify-start h-10 text-lg bg-black">
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
              <Button className="w-40" onClick={addHandler}>
                Agregar
              </Button>
              <Button className="w-40" onClick={onClose} variant="outline">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:hidden w-full justify-center items-center">
          <div className="w-60 h-60 flex justify-center">
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
                  <TableHead align="center" className="text-center">
                    Cantidad
                  </TableHead>
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
                <TableRow className="bg-gray-100">
                  <TableCell
                    colSpan={3}
                    className="font-bold text-lg px-5 py-5"
                  >
                    Total
                  </TableCell>
                  <TableCell align="right" className="py-5">
                    <Badge className="min-w-28 justify-start h-10 text-lg bg-black">
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
              <Button className="w-40" onClick={addHandler}>
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
