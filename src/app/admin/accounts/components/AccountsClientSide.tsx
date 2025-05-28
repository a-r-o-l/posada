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
import React, { useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  changeDisabled,
  removeChildFromAccount,
  updateAccount,
} from "@/server/accountAction";
import { toast } from "sonner";
import { CircleX, Search, Trash2 } from "lucide-react";
import CreateChildren from "./CreateChildren";
import { Checkbox } from "@/components/ui/checkbox";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { IStudentPopulated } from "@/models/Student";

function AccountsClientSide({
  accounts,
  students,
}: {
  accounts: IAccountPopulated[];
  students: IStudentPopulated[];
}) {
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountPopulated | null>(null);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openChildrenModal, setOpenChildrenModal] = useState(false);
  const [openVerifiedDialog, setOpenVerifiedDialog] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredAccounts = useMemo(() => {
    if (!accounts || !accounts.length) return [];
    if (!searchValue) return accounts;
    return accounts.filter((account: IAccountPopulated) => {
      const fullName = `${account.name} ${account.lastname}`.toLowerCase();
      return fullName.includes(searchValue.toLowerCase());
    });
  }, [accounts, searchValue]);

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
    <Card className="w-full" key={accounts.map((a) => a._id).join(",")}>
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
              <div className="flex items-center justify-center w-full">
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
                <div className="relative">
                  <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
                  {!!searchValue && (
                    <CircleX
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-red-500"
                      onClick={() => {
                        setSearchValue("");
                      }}
                    />
                  )}
                  <Input
                    placeholder="Buscar cuenta"
                    className="w-60 pl-10"
                    value={searchValue}
                    onKeyDown={(e) => {
                      if (selectedAccount) {
                        setSelectedAccount(null);
                      }
                      if (e.key === "Escape") {
                        setSearchValue("");
                      }
                    }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {filteredAccounts?.map((account) => (
                  <div
                    role="button"
                    key={account._id}
                    className={`flex items-center justify-between w-full p-4 mb-2 rounded-md border ${
                      selectedAccount?._id === account._id
                        ? "bg-secondary"
                        : "bg-background hover:bg-accent"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedAccount(account);
                    }}
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
                    {account.role !== "admin" && (
                      <Switch
                        checked={!account.disabled}
                        onCheckedChange={async () => {
                          const response = await changeDisabled(
                            account._id,
                            !account.disabled
                          );
                          if (response.success) {
                            toast.success(response.message);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-5">
                <CardTitle>Detalles de la cuenta</CardTitle>
                <CardDescription></CardDescription>
                {selectedAccount && (
                  <div className="flex items-center gap-2">
                    <Label>Verificada</Label>
                    <Checkbox
                      checked={selectedAccount?.verified}
                      onClick={() => setOpenVerifiedDialog(true)}
                    />
                  </div>
                )}
              </div>
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
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  {selectedAccount?.role !== "admin" && (
                    <div className="w-full">
                      <div className="flex w-full justify-between items-center">
                        <p className="font-black text-base">Menores a cargo</p>
                        <Button
                          onClick={() => {
                            setOpenChildrenModal(true);
                          }}
                          variant="link"
                        >
                          Agregar menor
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>nombre</TableHead>
                            <TableHead>apellido</TableHead>
                            <TableHead>Escuela</TableHead>
                            <TableHead>curso</TableHead>
                            <TableHead></TableHead>
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
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={async () => {
                                      const res = await removeChildFromAccount(
                                        selectedAccount._id,
                                        child
                                      );
                                      if (res.success) {
                                        toast.success(res.message);
                                      } else {
                                        toast.error(
                                          res.message ||
                                            "Error al eliminar el menor de la cuenta"
                                        );
                                      }
                                    }}
                                  >
                                    <Trash2 />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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
      <CreateChildren
        open={openChildrenModal}
        onClose={() => setOpenChildrenModal(false)}
        accountId={selectedAccount?._id || ""}
        students={students}
      />
      <CreateAccountModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
      />
      <CustomAlertDialog
        title="Verificacion de cuenta"
        description="¿Estás seguro de que quieres cambiar la verificación de esta cuenta?"
        open={openVerifiedDialog}
        onClose={() => setOpenVerifiedDialog(false)}
        onAccept={async () => {
          if (!selectedAccount) {
            toast.error("No hay una cuenta seleccionada");
            return;
          }
          const formData = new FormData();
          formData.append("verified", String(!selectedAccount.verified));
          const res = await updateAccount(selectedAccount._id, formData);
          if (res.success) {
            toast.success(res.message);
            setOpenVerifiedDialog(false);
          } else {
            toast.error(res.message || "Error al actualizar la cuenta");
          }
        }}
      />
    </Card>
  );
}

export default AccountsClientSide;
