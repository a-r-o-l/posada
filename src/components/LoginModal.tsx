"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustand/auth-store";
import { FcGoogle } from "react-icons/fc";
import LoadingButton from "./LoadingButton";
import { Loader2, LogIn } from "lucide-react";
import { login } from "@/server/sb-auth-actions";

const formSchema = z.object({
  email: z.string().email().min(4, {
    message: "El email debe ser válido.",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 4 caracteres.",
  }),
});

function LoginModal({
  open,
  onOpenChange,
  switchModal,
  additionalAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  switchModal: () => void;
  additionalAction: () => void;
}) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { loginWithGoogle, initializeAuth } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email.trim().toLowerCase());
    formData.append("password", values.password.trim());

    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) {
        toast.error(result.error);
        form.reset();
      } else {
        // Login exitoso, actualizar el store
        await initializeAuth();
        toast.success(`Bienvenido de nuevo, ${values.email}!`);
        onOpenChange(false);
      }
    });
  };

  useEffect(() => {
    if (open) {
      form.reset();
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-3 md:p-6">
        <DialogHeader className="p-0">
          <DialogTitle className="text-xl md:text-2xl font-bold">
            Inicia sesión en tu cuenta
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div>
            <div className="flex justify-center md:justify-start items-center gap-1 text-sm md:text-base">
              <p>¿No tienes una cuenta? </p>
              <Button
                className="underline font-bold text-blue-500 p-0 text-sm md:text-base"
                variant="link"
                onClick={switchModal}
                type="button"
              >
                Regístrate
              </Button>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5 p-0">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs md:text-base">
                      Correo Electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="juanperez@ejemplo.com"
                        {...field}
                        autoComplete="off"
                        ref={emailInputRef}
                        className="text-xs md:text-base"
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
                    <FormLabel className="text-xs md:text-base">
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        autoComplete="off"
                        type="password"
                        className="text-xs md:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full text-center p-0">
              <Button
                className="text-xs md:text-sm underline font-bold text-blue-500 p-0"
                variant="link"
                type="button"
                onClick={additionalAction}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            <div className="flex flex-col space-y-5 mt-10 p-0">
              <div className="space-y-4 w-full">
                <LoadingButton
                  title="Iniciar sesión"
                  type="submit"
                  classname="rounded-full text-xs md:text-base w-full"
                  loading={isPending}
                  disabled={isPending || googleLoading}
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
                  className="w-full cursor-pointer rounded-full text-xs md:text-base"
                  type="button"
                  onClick={async () => {
                    setGoogleLoading(true);
                    await loginWithGoogle();
                    setGoogleLoading(false);
                  }}
                  disabled={isPending || googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FcGoogle className="mr-2" />
                  )}
                  Iniciar sesión con Google
                </Button>
              </div>

              <Button
                className="w-full rounded-full text-xs md:text-base"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending || googleLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
