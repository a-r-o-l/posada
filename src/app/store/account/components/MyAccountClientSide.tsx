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
import {
  getAccountByEmail,
  removeChildFromAccount,
} from "@/server/accountAction";
import { IAccountPopulated, IChildrenPopulated } from "@/models/Account";
import { Label } from "@/components/ui/label";
import CreateChildren from "./CreateChildren";
import { IStudentPopulated } from "@/models/Student";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomAlertDialog from "@/components/CustomAlertDialog";

function MyAccountClientSide() {
  const router = useRouter();
  const { user } = useUser();
  const [account, setAccount] = useState<null | IAccountPopulated>(null);
  const [createChildrenModal, setCreateChildrenModal] =
    useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [childToRemove, setChildToRemove] = useState<IChildrenPopulated | null>(
    null
  );

  const schoolId = useMemo(() => {
    if (!user) return "";
    if (user?.children?.length === 0) {
      return "";
    }
    const firstChild = user.children[0];
    return firstChild.schoolId ? firstChild.schoolId : "";
  }, [user]);

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

  const handleChildAdded = (child: IStudentPopulated) => {
    setAccount((prev) => {
      if (!prev) return prev;
      const newChild = {
        name: child.name,
        lastname: child.lastname,
        schoolId: child.schoolId,
        gradeId: child.gradeId,
        studentId: child._id,
      };
      return {
        ...prev,
        children: [...prev.children, newChild],
      };
    });
  };

  const handleChildRemoved = async () => {
    if (!account || !childToRemove) return;
    const res = await removeChildFromAccount(account._id, childToRemove);
    if (res.success) {
      toast.success(res.message);
      setAccount((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          children: prev.children.filter(
            (c) =>
              !(
                c.name === childToRemove.name &&
                c.lastname === childToRemove.lastname
              )
          ),
        };
      });
      router.refresh();
    } else {
      toast.error(res.message || "Error al eliminar el menor de la cuenta");
    }
    setOpenAlert(false);
    setChildToRemove(null);
  };

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
          <div className="flex w-full justify-between items-center">
            <h1>Menores a cargo</h1>
            <Button
              variant="secondary"
              disabled={!schoolId}
              onClick={() => {
                setCreateChildrenModal(true);
              }}
            >
              <UserPlus className="" />
              Agregar menores
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colegio</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children?.map((child) => (
                <TableRow key={child.name}>
                  <TableCell>{child.schoolId?.name}</TableCell>
                  <TableCell>{child.gradeId?.displayName}</TableCell>
                  <TableCell>{child.name}</TableCell>
                  <TableCell>{child.lastname}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={async () => {
                        setChildToRemove(child);
                        setOpenAlert(true);
                      }}
                    >
                      eliminar
                    </Button>
                  </TableCell>
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
      <CreateChildren
        accountId={account._id}
        onClose={() => setCreateChildrenModal(false)}
        onChildAdded={handleChildAdded}
        open={createChildrenModal}
        schoolId={schoolId}
      />
      <CustomAlertDialog
        title="Estas seguro de eliminar el menor?"
        description="Esta accion no se puede deshacer"
        open={openAlert}
        onClose={() => {
          setOpenAlert(false);
          setChildToRemove(null);
        }}
        onAccept={async () => {
          await handleChildRemoved();
        }}
      />
    </Card>
  );
}

export default MyAccountClientSide;
