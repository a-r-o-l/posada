import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

function Stepper({
  steps,
  variant = "default",
}: {
  variant?: "default" | "outlined";
  steps: {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}) {
  const lastItem = steps[steps.length - 1];
  const circleStyle = cn(
    "w-14 min-h-14 rounded-full flex items-center justify-center",
    {
      "bg-blue-600 text-white": variant === "default",
      "border-4 border-blue-600 text-blue-600": variant === "outlined",
    }
  );
  return (
    <section
      className="max-w-7xl mx-auto flex flex-col items-center mt-32"
      id="cfunciona"
    >
      <Card className="bg-sky-200 dark:bg-black bg-opacity-30 backdrop-blur-sm">
        <CardHeader></CardHeader>
        <CardContent>
          {steps.map((step) => (
            <div className="flex gap-5" key={step.id}>
              <div className="flex flex-col items-center">
                <div className={circleStyle}>{step.icon}</div>
                {step.id !== lastItem?.id && (
                  <div className="w-1 h-full bg-blue-600"></div>
                )}
              </div>
              <div className="flex flex-col w-96 py-3">
                <h1 className="text-2xl font-bold text-blue-600">
                  {step.title}
                </h1>
                <p className="">{step.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="link">Ir a la Tienda</Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Stepper;
