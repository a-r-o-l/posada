"use client";
import PasswordInput from "@/components/PasswordInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useMemo, useState } from "react";
import { getAccountByEmail } from "@/server/accountAction";
import { IAccountPopulated } from "@/models/Account";
import { Label } from "@/components/ui/label";

function MyAccountClientSide() {
  const { user } = useUser();
  const [account, setAccount] = useState<null | IAccountPopulated>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      const { account: acc } = await getAccountByEmail(user?.email || "");
      setAccount(acc);
    };
    fetchAccount();
  }, [user?.email]);

  const children = useMemo(() => {
    if (!account) return [];
    if (account.children.length === 0) return [];
    return account.children;
  }, [account]);

  if (!account) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-muted-foreground">No hay cuenta</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi cuenta</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={account?.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input value={account?.lastname} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={account?.email} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <PasswordInput value={account?.password} disabled />
          </div>
        </div>
        <div className="mt-10">
          <h1>Menores a cargo</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colegio</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children?.map((child) => (
                <TableRow key={child.name}>
                  <TableCell>{child.schoolId?.name}</TableCell>
                  <TableCell>{child.gradeId?.displayName}</TableCell>
                  <TableCell>{child.name}</TableCell>
                  <TableCell>{child.lastname}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={4}>No hay menores</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyAccountClientSide;
