"use client";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { IAccount } from "@/models/Account";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { handleSendEmail } from "@/server/emailsAction";
import { LoadingInput } from "@/components/edited/input";
import { passwordRecoveryTemplate } from "@/templates/passwordReacovery";

const formSchema = z.object({
  email: z.string().email().min(4, {
    message: "El nombre de usuario debe tener al menos 4 caracteres.",
  }),
});

function ForgetPasswordForm({
  foundAccount,
}: {
  foundAccount: IAccount | null;
}) {
  const router = useRouter();
  const [inputLoading, setInputLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { errors } = form.formState;

  const emailWatch = form.watch("email");

  useEffect(() => {
    setInputLoading(true);
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (emailWatch) {
        params.set("email", emailWatch);
      } else {
        params.delete("email");
      }
      router.push(`/signin/forgetpassword?${params.toString()}`);
      setInputLoading(false);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [emailWatch, router]);

  useEffect(() => {
    if (!foundAccount && emailWatch) {
      form.setError("email", {
        type: "onChange",
        message: "No se encontró una cuenta con ese email",
      });
    } else {
      form.clearErrors("email");
    }
  }, [foundAccount, emailWatch, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", "Recuperar contraseña");
      formData.append("name", foundAccount?.name || "");
      formData.append("email", values.email);
      const res = await handleSendEmail(
        formData,
        passwordRecoveryTemplate(foundAccount?.password || "")
      );
      if (res.success) {
        setSubmitLoading(false);
        toast.success("Revisa tu correo para recuperar tu contraseña.");
        router.push("/signin");
      } else {
        setSubmitLoading(false);
        toast.error(res.message);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error("Error sending email:", error);
      toast.error("Error al enviar el correo, intente nuevamente");
    }
  }

  return (
    <div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="w-96">
              <Button
                onClick={() => router.push("/signin")}
                variant="ghost"
                className="mb-5 w-28 justify-start px-0"
                type="button"
              >
                <ArrowLeft />
                Volver
              </Button>
              <CardTitle className="text-2xl font-bold">
                Recuperar contraseña
              </CardTitle>
              <CardDescription>
                Ingresa tu correo electrónico y te enviaremos un mail para que
                puedas recuperar tu contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <LoadingInput
                        loading={inputLoading}
                        condition={!!foundAccount}
                        error={!!errors.email}
                        placeholder="juanperez@ejemplo.com"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 mt-10">
              <LoadingButton
                title="Enviar"
                type="submit"
                classname="w-full"
                disabled={inputLoading || !foundAccount || !!errors.email}
                loading={submitLoading}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default ForgetPasswordForm;
