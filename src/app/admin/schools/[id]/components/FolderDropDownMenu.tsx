"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2, View } from "lucide-react";
import { Button } from "@/components/ui/button";

function FolderDropDownMenu({
  onEditClick,
  onDeleteClick,
  onViewClick,
  onClick,
  title,
}: {
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
  onClick: () => void;
  title: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={onClick}>
        <Button variant="ghost" size="icon" className="rounded-full">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onViewClick}
            className="flex items-center justify-between"
          >
            Ver
            <View />
          </DropdownMenuItem>
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

export default FolderDropDownMenu;
