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
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductDropDownMenu({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}) {
  // Función para limpiar el foco antes de ejecutar acciones
  const handleAction = (callback: (e: React.MouseEvent) => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      // Forzar blur del elemento actualmente enfocado
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Pequeño delay para asegurar que el blur se complete antes de abrir el modal
      setTimeout(() => {
        callback(e);
      }, 10);
    };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleAction(onEditClick)}
            className="flex items-center justify-between"
          >
            Editar
            <Pencil />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleAction(onDeleteClick)}
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

export default ProductDropDownMenu;
