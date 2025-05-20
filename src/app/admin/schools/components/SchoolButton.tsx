import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initialsParser } from "@/lib/utilsFunctions";
import { PartialSchool } from "@/models/School";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function SchoolButton({ school }: { school: PartialSchool }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-28 w-28 border-4">
          <AvatarImage
            src={school.imageUrl}
            alt={school.name}
            className="object-contain !aspect-square p-1"
          />
          <AvatarFallback>{initialsParser(school?.name || "")}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{school.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/schools/${school._id}`)}
          >
            <ExternalLink />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem className="">
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className=" text-red-500">
            <Trash2 />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SchoolButton;
