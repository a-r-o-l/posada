import React, { useEffect, useState, useTransition } from "react";
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
import { ScrollArea } from "./ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustand/auth-store";
import { FcGoogle } from "react-icons/fc";
import LoadingButton from "./LoadingButton";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginToSyncCookies } from "@/server/sb-auth-actions";

interface SignupData {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone?: string;
  role?: "admin" | "user";
}
const formSchemaRegister = z.object({
  emailr: z
    .string()
    .email({ message: "El correo electrónico debe ser válido." })
    .nonempty({ message: "El correo electrónico es requerido." }),
  namer: z
    .string()
    .nonempty({ message: "El nombre es requerido." })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "El nombre solo puede contener letras y espacios.",
    }),
  lastnamer: z
    .string()
    .nonempty({ message: "El apellido es requerido." })
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "El apellido solo puede contener letras y espacios.",
    }),
  passwordr: z
    .string()
    .nonempty({ message: "La contraseña es requerida." })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  phoner: z
    .string()
    .nonempty({ message: "El teléfono es requerido." })
    .min(9, { message: "El telefono debe tener al menos 9 caracteres." }),
});

function RegisterModal({
  open,
  onOpenChange,
  switchModal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  switchModal: () => void;
}) {
  const router = useRouter();
  const { loginWithGoogle, register, initializeAuth, login } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [googleLoading, setGoogleLoading] = useState(false);

  const formRegister = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      namer: "",
      lastnamer: "",
      emailr: "",
      phoner: "",
      passwordr: "",
    },
  });

  function onSubmitRegister(values: z.infer<typeof formSchemaRegister>) {
    startTransition(async () => {
      try {
        const formData: SignupData = {
          name: values.namer.trim(),
          lastname: values.lastnamer.trim(),
          email: values.emailr.trim().toLowerCase(),
          phone: values.phoner.trim(),
          password: values.passwordr.trim(),
        };

        const registerResult = await register(formData);

        if (!registerResult.success) {
          if (registerResult.errorType === "email_exists") {
            toast.error(
              "Ese correo ya está registrado. Probá iniciando sesión.",
            );
            return;
          }

          toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
          return;
        }

        const loginSuccess = await login(
          values.emailr.trim().toLowerCase(),
          values.passwordr.trim(),
        );

        if (!loginSuccess) {
          toast.error(
            "La cuenta se creó, pero no se pudo iniciar sesión automáticamente.",
          );
          return;
        }

        await initializeAuth();

        // Sincronizar cookies en servidor para que middleware los vea
        const syncResult = await loginToSyncCookies(
          values.emailr.trim().toLowerCase(),
          values.passwordr.trim(),
        );
        if (syncResult?.error) {
          console.error("Error sincronizando cookies:", syncResult.error);
        }

        toast.success("¡Cuenta creada! Redirigiendo a configuración...");
        onOpenChange(false);
        router.push(`/onboarding`);
      } catch (error) {
        console.error("Error en flujo de registro:", error);
        toast.error("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.");
      }
    });
  }

  useEffect(() => {
    formRegister.reset();
  }, [open, formRegister]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-1.5rem)] overflow-hidden p-3 md:p-6"
        showCloseButton={false}
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg md:text-2xl font-bold">
            Crear una cuenta nueva
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div>
            <div className="flex justify-center md:justify-start items-center gap-1 text-sm md:text-base">
              <p>¿Ya tienes una cuenta? </p>
              <Button
                className="underline font-bold text-blue-500 p-0 text-sm md:text-base"
                variant="link"
                onClick={switchModal}
                type="button"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[min(72dvh,38rem)] mt-3 pr-1">
          <Form {...formRegister}>
            <form onSubmit={formRegister.handleSubmit(onSubmitRegister)}>
              <div className="space-y-4 md:space-y-5 p-0">
                <FormField
                  control={formRegister.control}
                  name="namer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-base">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          className="text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="lastnamer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-base">
                        Apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pérez"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          className="text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formRegister.control}
                  name="phoner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-base">
                        Telefono
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+54 9 11-1234-1234"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          type="number"
                          className="text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="emailr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-base">
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="juanperez@ejemplo.com"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          className="text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="passwordr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-base">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          type="password"
                          className="text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-4 md:space-y-5 mt-8 md:mt-10 pb-1">
                <LoadingButton
                  loading={isPending}
                  title="Crear Cuenta"
                  type="submit"
                  classname="rounded-full text-xs md:text-base w-full"
                  disabled={isPending}
                >
                  {!isPending && <UserPlus className="mr-2 h-4 w-4" />}
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
                  Continuar con Google
                </Button>
                <Button
                  className="w-full rounded-full text-xs md:text-base"
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;
