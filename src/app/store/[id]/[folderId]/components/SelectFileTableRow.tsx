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
                className="rounded-full p-0 w-7 h-7"
                variant="outline"
              >
                <Info />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 z-50">
              <p className="font-semibold text-sm">{item.name}</p>
              <Separator className="mb-3 mt-1" />
              <p className="font-normal text-sm text-gray-400">
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
          className="rounded-full p-0 w-7 h-7"
          variant="ghost"
          onClick={onMinus}
        >
          <Minus />
        </Button>
        {item.quantity}
        <Button
          size="icon"
          className="rounded-full p-0 w-7 h-7"
          variant="ghost"
          onClick={onPlus}
        >
          <Plus />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default SelectFileTableRow;
