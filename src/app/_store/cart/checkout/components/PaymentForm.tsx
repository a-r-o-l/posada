"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AtSign,
  FileText,
  Fingerprint,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useCartStore } from "@/zustand/useCartStore";

const initialValues = {
  name: "",
  lastName: "",
  dni: "",
  address: "",
  phone: "",
};

function PaymentForm() {
  const products = useCartStore((state) => state.products);
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>Datos del comprador</CardTitle>
        <CardDescription>
          Complete los datos personales para facilitar la entrega
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5 p-2">
          <div className="flex gap-2 items-center">
            <Label className="w-16">Nombre</Label>
            <div className="relative w-80">
              <div className="absolute justify-center items-center flex left-2 h-full w-5">
                <User className="" size={15} />
              </div>
              <Input
                className="pl-8"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-16">Apellido</Label>
            <div className="relative w-80">
              <div className="absolute justify-center items-center flex left-2 h-full w-5">
                <User className="" size={15} />
              </div>
              <Input
                className="pl-8"
                name="lastname"
                value={values.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-16">Email</Label>
            <div className="relative w-80">
              <div className="absolute justify-center items-center flex left-2 h-full w-5">
                <AtSign className="" size={13} />
              </div>
              <Input
                className="pl-8"
                name="dni"
                value={values.dni}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-16">Celular</Label>
            <div className="relative w-80">
              <div className="absolute justify-center items-center flex left-2 h-full w-5">
                <Phone className="" size={15} />
              </div>
              <Input
                className="pl-8"
                name="phone"
                value={values.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PaymentForm;
