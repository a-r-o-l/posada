"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { handleSendEmail } from "@/server/emailsAction";
import { Button } from "./ui/button";

function SendEmailForm() {
  const [values, setValues] = useState({
    subject: "",
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);
    const response = await handleSendEmail(formData);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-80 mt-20 px-10">
      <div className="space-y-2">
        <Label>Asunto</Label>
        <Input value={values.subject} onChange={handleChange} name="subject" />
      </div>
      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input value={values.name} onChange={handleChange} name="name" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={values.email} onChange={handleChange} name="email" />
      </div>
      <div className="space-y-2">
        <Label>Mensaje</Label>
        <Textarea
          value={values.message}
          onChange={(e) =>
            setValues({
              ...values,
              [e.target.name]: e.target.value,
            })
          }
          name="message"
        />
      </div>
      <div className="mt-5 flex justify-end">
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  );
}

export default SendEmailForm;
