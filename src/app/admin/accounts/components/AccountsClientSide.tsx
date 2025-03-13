"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import { IAccountPopulated, IChildrenPopulated } from "@/models/Account";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PasswordInput from "@/components/PasswordInput";
import CreateAccountModal from "./CreateAccountModal";
import { Badge } from "@/components/ui/badge";

function AccountsClientSide({ accounts }: { accounts: IAccountPopulated[] }) {
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountPopulated | null>(null);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const RenderBadge = ({ role }: { role: string }) => {
    if (!role) {
      return <></>;
    } else if (role === "admin") {
      return (
        <Badge
          className="w-20 text-center justify-center bg-red-500 text-white"
          variant="outline"
        >
          Admin
        </Badge>
      );
    } else if (role === "superuser") {
      return (
        <Badge
          className="w-20 text-center justify-center bg-blue-500 text-white"
          variant="outline"
        >
          Superuser
        </Badge>
      );
    } else {
      return (
        <Badge
          className="w-20 text-center justify-center bg-green-500 text-white"
          variant="outline"
        >
          User
        </Badge>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Cuentas</CardTitle>
          <CardDescription>Ver y administrar cuentas</CardDescription>
        </div>
        <Button onClick={() => setOpenAccountModal(true)}>Crear cuenta</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Lista de cuentas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {accounts?.map((account) => (
                  <Button
                    key={account._id}
                    variant={
                      selectedAccount?._id === account._id
                        ? "secondary"
                        : "outline"
                    }
                    className="w-full justify-start text-left mb-2 py-10"
                    onClick={() => setSelectedAccount(account)}
                  >
                    <div className="flex items-center space-x-2 w-full justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex flex-col items-center">
                          <RenderBadge role={account.role} />
                        </div>

                        <div>
                          <div className="font-semibold">
                            {account.name} {account.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.email}
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-full flex items-center justify-end"></div>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAccount ? (
                <div className="flex flex-col justify-center gap-10">
                  <div>
                    <div className="space-y-2">
                      <Label onClick={() => console.log(selectedAccount)}>
                        Nombre
                      </Label>
                      <Input value={selectedAccount.name} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input
                        value={selectedAccount.lastname}
                        disabled
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefono</Label>
                      <Input value={selectedAccount.phone} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>email</Label>
                      <Input value={selectedAccount.email} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>password</Label>
                      <PasswordInput
                        value={selectedAccount.password}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="font-black text-base">Menores a cargo</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>nombre</TableHead>
                          <TableHead>apellido</TableHead>
                          <TableHead>Escuela</TableHead>
                          <TableHead>curso</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAccount.children.map(
                          (child: IChildrenPopulated) => (
                            <TableRow
                              key={`${child.name}${child.lastname}${child.gradeId}`}
                            >
                              <TableCell>{child.name}</TableCell>
                              <TableCell>{child.lastname}</TableCell>
                              <TableCell>{child.schoolId.name}</TableCell>
                              <TableCell>
                                {child.gradeId.grade} {child.gradeId.division}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No hay una cuenta seleccionada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CreateAccountModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
      />
    </Card>
  );
}

export default AccountsClientSide;
