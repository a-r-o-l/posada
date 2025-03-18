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
import { Input } from "@/components/ui/input";
import { createAccount } from "@/server/accountAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "El correo electrónico debe ser válido." })
    .nonempty({ message: "El correo electrónico es requerido." }),
  name: z
    .string()
    .nonempty({ message: "El nombre es requerido." })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "El nombre solo puede contener letras y espacios.",
    }),
  lastname: z
    .string()
    .nonempty({ message: "El apellido es requerido." })
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "El apellido solo puede contener letras y espacios.",
    }),
  password: z
    .string()
    .nonempty({ message: "La contraseña es requerida." })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  phone: z
    .string()
    .nonempty({ message: "El teléfono es requerido." })
    .min(9, { message: "El telefono debe tener al menos 9 caracteres." }),
});

function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      const response = await createAccount(formData);
      if (response.success) {
        toast.success(response.message);
        router.push(`/signup/extradata?account=${response.account._id}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error en el servidor, intente nuevamente");
    }
  }

  return (
    <div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Crear una cuenta nueva
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <p>¿Ya tienes una cuenta? </p>
                  <Link
                    href="/signin"
                    className="underline font-bold text-blue-500"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pérez"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Telefono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+54 9 11-1234-1234"
                        {...field}
                        autoComplete="off"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Correo Electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="juanperez@ejemplo.com"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        autoComplete="off"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-5 mt-10">
              <LoadingButton
                loading={loading}
                title="Crear Cuenta"
                type="submit"
                classname="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
              </LoadingButton>
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default SignUpForm;
