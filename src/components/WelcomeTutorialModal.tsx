"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Confetti from "react-confetti";
import { ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWelcomeTutorialStore } from "@/zustand/useWelcomeTutorialStore";

type TutorialStep = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    title: "Volvimos Con Novedades",
    description:
      "Nos alegra tenerte de vuelta en Fotos Posada. Actualizamos la tienda con nuevas funciones para que comprar y gestionar tus fotos sea mas rapido, claro y comodo. Este mini tutorial te va a mostrar lo mas importante en menos de un minuto.",
    image: "/ui/products/random2.jpeg",
    imageAlt: "Bienvenida a Fotos Posada",
    badge: "Bienvenida",
  },
  {
    title: "Completa tus preferencias por unica vez",
    description:
      "Cuando ingreses a la tienda vas a pasar por un proceso donde actualizaremos tu informacion adicional. Primero vas a elegir el colegio al que pertenecen tus hijos y despues actualizaras los datos nuevamente de cada uno. Eso nos permite mostrarte contenido personalizado correctamente.",
    image: "/ui/products/random1.jpeg",
    imageAlt: "Onboarding de colegio e hijos",
    badge: "Paso 1",
  },
  {
    title: "Nueva Seccion Mis Fotos",
    description: `Ahora podés encontrar y descargar todas las fotos digitales que compres en el sitio, directamente desde la sección "Mis Fotos".
¿Cómo funciona?
Cuando realices una compra, las fotos aparecerán en esta sección, pero permanecerán pendientes y deshabilitadas para descargar hasta que se apruebe el pago.
Una vez que el pago esté confirmado, las fotos se habilitarán automáticamente y las podrás descargar cuando quieras, las veces que necesites.`,
    image: "/ui/products/random2.jpeg",
    imageAlt: "Seccion Mis Fotos",
    badge: "Paso 2",
  },
  {
    title: "Entregas de Fotos Impresas Sin Cambios",
    description:
      "Los demas productos (impresos en papel fotografico) se seguiran enviando al colegio correspondiente, como de costumbre. En esta nueva version de la web, el unico cambio en el proceso de entrega aplica a los archivos digitales, todo lo demas mantiene exactamente la misma modalidad de siempre.",
    image: "/ui/products/random1.jpeg",
    imageAlt: "Entrega de productos impresos en colegio",
    badge: "Paso 3",
  },
];

export default function WelcomeTutorialModal() {
  const hasSeenTutorial = useWelcomeTutorialStore((s) => s.hasSeenTutorial);
  const hasHydrated = useWelcomeTutorialStore((s) => s.hasHydrated);
  const markTutorialAsSeen = useWelcomeTutorialStore(
    (s) => s.markTutorialAsSeen,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!hasHydrated) return;
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, [hasHydrated, hasSeenTutorial]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const progress = useMemo(
    () => ((currentStep + 1) / tutorialSteps.length) * 100,
    [currentStep],
  );

  const handleClose = () => {
    markTutorialAsSeen();
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep === tutorialSteps.length - 1) {
      handleClose();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (!hasHydrated) return null;

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => !nextOpen && handleClose()}
    >
      {isOpen && isFirstStep && viewport.width > 0 && viewport.height > 0 ? (
        <Confetti
          width={viewport.width}
          height={viewport.height}
          recycle={false}
          numberOfPieces={220}
          gravity={0.28}
          className="pointer-events-none z-[60]"
        />
      ) : null}

      <DialogContent
        showCloseButton={false}
        className="max-w-3xl p-0 overflow-hidden border-0 bg-transparent shadow-none"
      >
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.55)] overflow-hidden">
          <div className="relative bg-[linear-gradient(120deg,#0f172a_0%,#1e3a8a_58%,#16a34a_100%)] px-6 py-5 sm:px-8 sm:py-6">
            <div className="absolute -top-24 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-emerald-300/25 blur-2xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                <PartyPopper className="h-3.5 w-3.5" />
                {step.badge}
              </div>
              <p className="text-xs font-medium text-white/90">
                Paso {currentStep + 1} de {tutorialSteps.length}
              </p>
            </div>

            <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[1.08fr_1fr]">
            <div className="relative min-h-[240px] bg-slate-100 md:min-h-[360px]">
              <Image
                src={step.image}
                alt={step.imageAlt}
                fill
                className="object-cover"
                priority={isFirstStep}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <DialogHeader className="space-y-4 text-left">
                <div
                  style={{ backgroundImage: "url(/logoposada.png)" }}
                  className="h-14 w-40 bg-contain bg-left bg-no-repeat"
                />
                <DialogTitle className="text-2xl font-black leading-tight text-slate-900">
                  {step.title}
                </DialogTitle>
                <DialogDescription className="text-[15px] leading-relaxed text-slate-700">
                  {step.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-auto pt-6 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="rounded-full px-5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full px-6 bg-slate-900 hover:bg-slate-800"
                >
                  {isLastStep ? "Finalizar" : "Continuar"}
                  {!isLastStep ? <ArrowRight className="h-4 w-4" /> : null}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
