"use client";
import LoadingButton from "@/components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISchool } from "@/models/School";
import { createAccount } from "@/server/accountAction";
import { getAllSchools } from "@/server/schoolAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CreateAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [schools, setSchools] = useState<[] | ISchool[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const response = await createAccount(formData, true);
      if (response.success) {
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error en el servidor, intente nuevamente");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchSchools = async () => {
      const { schools } = await getAllSchools();
      setSchools(schools);
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedRole("admin");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Crear cuenta</DialogTitle>
            <DialogDescription>
              Complete los campos para crear una nueva cuenta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Tipo de cuenta</Label>
              <RadioGroup
                name="role"
                defaultValue="admin"
                onValueChange={(value) => setSelectedRole(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="superuser" id="superuser" />
                  <Label htmlFor="superuser">Super User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
              </RadioGroup>
            </div>
            {selectedRole === "superuser" && (
              <div className="space-y-2">
                <Label>Seleccionar Colegio</Label>
                <Select name="schoolId">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un colegio" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools?.map((school) => (
                      <SelectItem key={school._id} value={school._id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Nombre</Label>
              <Input
                autoComplete="off"
                name="name"
                type="text"
                className="Input"
              />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input
                autoComplete="off"
                name="lastname"
                type="text"
                className="Input"
              />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input
                autoComplete="off"
                name="phone"
                type="number"
                className="Input"
              />
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <Input
                autoComplete="off"
                name="email"
                type="email"
                className="Input"
              />
            </div>
            <div>
              <Label>Password</Label>
              <PasswordInput name="password" />
            </div>
          </div>
          <DialogFooter className="mt-5">
            <LoadingButton
              title="Crear cuenta"
              classname="w-32"
              loading={loading}
              onClick={() => {}}
              type="submit"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-32"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAccountModal;
