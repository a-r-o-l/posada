"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

function CustomDropDownMenu({
  onEditClick,
  onDeleteClick,
  title,
}: {
  onEditClick: () => void;
  onDeleteClick: () => void;
  title: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-full cursor-pointer p-2 hover:bg-background">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onEditClick}
            className="flex items-center justify-between"
          >
            Editar
            <Pencil />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDeleteClick}
            className="flex items-center justify-between text-red-500"
          >
            Eliminar
            <Trash2 />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomDropDownMenu;
