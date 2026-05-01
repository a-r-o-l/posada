import React from "react";
import { TableCell, TableRow } from "./ui/table";
import { Loader2 } from "lucide-react";

function LoadingTable({ span = 5 }: { span: number }) {
  return (
    <TableRow className="h-40">
      <TableCell colSpan={span} className="text-center">
        <Loader2 className="animate-spin mx-auto" />
      </TableCell>
    </TableRow>
  );
}

export default LoadingTable;
