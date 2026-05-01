import React, { useEffect, useState } from "react";
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
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const { loginWithGoogle, register } = useAuthStore();
  const [loadingRegister, setLoadingRegister] = useState(false);

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

  async function onSubmitRegister(values: z.infer<typeof formSchemaRegister>) {
    setLoadingRegister(true);
    const formData: SignupData = {
      name: values.namer,
      lastname: values.lastnamer,
      email: values.emailr,
      phone: values.phoner,
      password: values.passwordr,
    };
    const success = await register(formData);
    if (success) {
      toast.success(
        "Cuenta creada exitosamente. Por favor, completa tus datos adicionales.",
      );
      router.push(`/onboarding`);
    } else {
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
      setLoadingRegister(false);
    }
  }

  useEffect(() => {
    formRegister.reset();
  }, [open, formRegister]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Crear una cuenta nueva
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div>
            <div className="flex items-center gap-1">
              <p>¿Ya tienes una cuenta? </p>
              <Button
                className="underline font-bold text-blue-500 p-0"
                variant="link"
                onClick={switchModal}
                type="button"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </DialogHeader>
        <Form {...formRegister}>
          <form onSubmit={formRegister.handleSubmit(onSubmitRegister)}>
            <FormField
              control={formRegister.control}
              name="namer"
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
              control={formRegister.control}
              name="lastnamer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} autoComplete="off" />
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
              control={formRegister.control}
              name="emailr"
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
              control={formRegister.control}
              name="passwordr"
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
            <div className="w-full text-center">
              <Button
                className="text-sm underline font-bold text-blue-500 p-0"
                variant="link"
                type="button"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            <div className="flex flex-col space-y-5 mt-10 px-20">
              <LoadingButton
                loading={loadingRegister}
                title="Crear Cuenta"
                type="submit"
                classname="w-full rounded-full"
                disabled={loadingRegister}
              >
                {!loadingRegister && <UserPlus className="mr-2 h-4 w-4" />}
              </LoadingButton>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-400"></div>
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
                disabled={loadingRegister}
              >
                <FcGoogle size={30} className="mr-2" />
                Continuar con Google
              </Button>
              <Button
                className="w-full rounded-full"
                type="button"
                variant="outline"
                disabled={loadingRegister}
                onClick={() => onOpenChange(false)}
                size="lg"
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

export default RegisterModal;
