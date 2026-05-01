"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ServiceAccordion from "./ServiceAccordion";
import { useRouter } from "next/navigation";

function ServicesClientSide() {
  const router = useRouter();
  const [firstEnter, setFirstEnter] = useState(true);

  if (firstEnter) {
    return (
      <div className="p-4 w-full mx-auto container flex flex-col gap-2">
        <Button onClick={() => router.push("services/files")}>files</Button>
        <Button onClick={() => router.push("services/folders")}>folders</Button>
        <Button onClick={() => router.push("services/grades")}>grades</Button>
        <Button onClick={() => router.push("services/products")}>
          products
        </Button>
        <Button onClick={() => router.push("services/profile")}>profile</Button>
        <Button onClick={() => router.push("services/sales")}>sales</Button>
        <Button onClick={() => router.push("services/schools")}>schools</Button>
        <Button onClick={() => router.push("services/students")}>
          students
        </Button>

        <h1 className="text-2xl font-bold">Servicios</h1>
        <p className="text-sm text-muted-foreground">
          Servicios usados en la web
        </p>
        <Button onClick={() => setFirstEnter(false)} className="w-20">
          Ingresar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Servicios</h1>
      <p className="text-sm text-muted-foreground">
        Servicios usados en la web
      </p>
      <div>
        <ServiceAccordion
          title="AWS"
          link="https://us-east-2.signin.aws.amazon.com/"
          linkTitle="Amazon web services"
          content={
            <>
              <div className="flex items-center gap-2">
                <p className="font-black">Usuario raiz: </p>
                <p> crisposada22@gmail.com</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-black">Usuario secundario: </p>
                <p>posadauser</p>
              </div>
            </>
          }
        />
        <ServiceAccordion
          title="ZOHO"
          link="https://mail.zoho.com/"
          linkTitle="Zoho mail"
          content={
            <div className="flex items-center gap-2">
              <p className="font-black">Usuario raiz: </p>
              <p> crisposada22@gmail.com</p>
            </div>
          }
        />
        <ServiceAccordion
          title="BREVO"
          link="https://brevo.com/"
          linkTitle="Brevo"
          content={
            <div className="flex items-center gap-2">
              <p className="font-black">Usuario: </p>
              <p> crisposada22@gmail.com</p>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default ServicesClientSide;
