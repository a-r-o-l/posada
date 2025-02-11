"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMessage } from "@/server/messageAction";
import React, { useState } from "react";
import { toast } from "sonner";
import LoadingButton from "./LoadingButton";
import { Send } from "lucide-react";

const initialValues = {
  title: "",
  name: "",
  email: "",
  text: "",
};

function HomeFormContact() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("text", values.text);

      const res = await createMessage(formData);
      if (res.success) {
        setValues(initialValues);
        setLoading(false);
        toast.success(res.message);
      } else {
        setLoading(false);
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error en el servidor, intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <section className="mt-20 max-w-7xl mx-auto my-20">
      <Card className="bg-sky-200 dark:bg-black bg-opacity-30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Contactanos</CardTitle>
          <CardDescription>
            Envianos un mensaje y te responderemos cuanto antes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="title">Titulo</label>
                <Input
                  id="title"
                  name="title"
                  autoComplete="off"
                  value={values.title}
                  onChange={handleChange}
                  className="border-black"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name">Nombre</label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Correo electrónico</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={values.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="text">Mensaje</label>
              <Textarea
                id="text"
                name="text"
                rows={4}
                autoComplete="off"
                value={values.text}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end pt-10">
              <LoadingButton
                type="button"
                loading={loading}
                title="Enviar"
                classname="w-40"
                disabled={
                  !values.title || !values.name || !values.email || !values.text
                }
                onClick={handleSubmit}
              >
                <Send size={20} />
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export default HomeFormContact;
