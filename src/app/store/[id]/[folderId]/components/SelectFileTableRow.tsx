import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { IProduct } from "@/models/Product";
import { Info, Minus, Plus } from "lucide-react";
import React from "react";

interface IProductWithQuantity extends IProduct {
  quantity: number;
}

function SelectFileTableRow({
  item,
  onPlus,
  onMinus,
}: {
  item: IProductWithQuantity;
  onPlus: () => void;
  onMinus: () => void;
}) {
  return (
    <TableRow>
      <TableCell>
        {!!item.description && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className="rounded-full p-0 w-5 h-5"
                variant="outline"
              >
                <Info />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 z-50">
              <p className="font-semibold text-xs">{item.name}</p>
              <Separator className="mb-3 mt-1" />
              <p className="font-normal text-xs text-gray-400">
                {item.description}
              </p>
            </PopoverContent>
          </Popover>
        )}
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>
        ${" "}
        {item.price.toLocaleString("es-ES", {
          minimumFractionDigits: 0,
        })}
      </TableCell>
      <TableCell className="flex justify-between items-center">
        <Button
          size="icon"
          className="rounded-full p-0 w-5 h-5 bg-red-300 text-black hover:bg-red-600 hover:text-white"
          variant="outline"
          onClick={onMinus}
        >
          <Minus />
        </Button>
        <p className="font-black">{item.quantity}</p>
        <Button
          size="icon"
          className="rounded-full p-0 w-5 h-5 bg-green-100 text-black hover:bg-green-500 hover:text-white"
          variant="outline"
          onClick={onPlus}
        >
          <Plus />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default SelectFileTableRow;
