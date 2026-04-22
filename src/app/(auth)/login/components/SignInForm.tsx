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
import { useAuthStore } from "@/zustand/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().min(4, {
    message: "El nombre de usuario debe tener al menos 4 caracteres.",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 4 caracteres.",
  }),
});

function SignInForm() {
  const router = useRouter();
  const { login, isLoading, loginWithGoogle } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   setIsSubmitting(true);
  //   const email = values.email.toLowerCase();
  //   const response = await login(email, values.password);
  //   if (response) {
  //     toast.success(`Bienvenido ${values.email.toLowerCase()}`);
  //     setIsSubmitting(false);
  //     router.push("/sadmin");
  //   } else {
  //     toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const email = values.email.toLowerCase();
    const success = await login(email.toLowerCase(), values.password);

    if (success) {
      toast.success("Bienvenido");
      // El middleware se encargará de redirigir según el rol
    } else {
      toast.error("Credenciales incorrectas");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Inicia sesión en tu cuenta
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <p>¿No tienes una cuenta? </p>
                  <Link
                    href="/signup"
                    className="underline font-bold text-blue-500"
                  >
                    Regístrate
                  </Link>
                </div>
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
                      <Input
                        placeholder="juanperez@ejemplo.com"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        autoComplete="off"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full text-center">
                <Link
                  href="/signin/forgetpassword"
                  className="text-sm underline font-bold text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 mt-10">
              <div className="space-y-4 w-full">
                <LoadingButton
                  title="Iniciar sesión"
                  type="submit"
                  classname="w-full rounded-full"
                  loading={isSubmitting}
                  disabled={isSubmitting || isLoading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                </LoadingButton>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-400">o</span>
                  </div>
                </div>
                <Button
                  className="w-full cursor-pointer rounded-full"
                  type="button"
                  onClick={() => loginWithGoogle()}
                  size="lg"
                >
                  <FcGoogle size={30} className="mr-2" />
                  Iniciar sesión con Google
                </Button>
              </div>

              <Button
                className="w-full rounded-full"
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={isSubmitting || isLoading}
                size="lg"
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

export default SignInForm;
