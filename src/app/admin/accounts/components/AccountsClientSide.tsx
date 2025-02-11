"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import React, { useState } from "react";
import { IAccount } from "@/models/Account";
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

function AccountsClientSide({ accounts }: { accounts: IAccount[] }) {
  const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cuentas</CardTitle>
        <CardDescription>Ver y administrar cuentas</CardDescription>
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
                        <User className="w-4 h-4" />

                        <div>
                          <div className="font-semibold">
                            {account.name} {account.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.email}
                          </div>
                        </div>
                      </div>
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
                    <p className="font-black text-base">Hijos de la cuenta</p>
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
                        {selectedAccount.children.map((child) => (
                          <TableRow
                            key={`${child.name}${child.lastname}${child.grade}`}
                          >
                            <TableCell>{child.name}</TableCell>
                            <TableCell>{child.lastname}</TableCell>
                            <TableCell>{child.school}</TableCell>
                            <TableCell>{child.grade}</TableCell>
                          </TableRow>
                        ))}
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
    </Card>
  );
}

export default AccountsClientSide;
