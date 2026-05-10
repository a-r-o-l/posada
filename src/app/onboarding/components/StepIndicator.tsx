import React from "react";

interface StepIndicatorProps {
  type: string;
  label: string;
  stepNumber: number;
  displayText: string;
}

const StepIndicator = ({
  currentStep = 0,
  setStep,
}: {
  currentStep: number;
  setStep: (step: number) => void;
}) => {
  const steps = [
    { type: "pill", label: "Inicio", stepNumber: 0, displayText: "Inicio" },
    { type: "circle", label: "Paso 1", stepNumber: 1, displayText: "1" },
    { type: "circle", label: "Paso 2", stepNumber: 2, displayText: "2" },
  ];

  const getStepStyle = (step: StepIndicatorProps) => {
    const isActive = step.stepNumber === currentStep;
    const isCompleted = step.stepNumber < currentStep;

    // Todos los elementos tienen la misma altura (h-8)
    if (step.type === "pill") {
      const baseStyle =
        "h-8 px-4 rounded-full text-sm font-medium whitespace-nowrap flex items-center justify-center";
      if (isActive)
        return `${baseStyle} bg-blue-600 text-white ring-2 ring-blue-300`;
      if (isCompleted) return `${baseStyle} bg-blue-600 text-white`;
      return `${baseStyle} bg-gray-200 dark:bg-gray-700 text-gray-500`;
    } else {
      const baseStyle =
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold";
      if (isActive)
        return `${baseStyle} bg-blue-600 text-white ring-2 ring-blue-300`;
      if (isCompleted) return `${baseStyle} bg-blue-600 text-white`;
      return `${baseStyle} bg-gray-200 dark:bg-gray-700 text-gray-500`;
    }
  };

  const getLineStyle = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return "bg-blue-500";
    }
    return "bg-gray-300 dark:bg-gray-600";
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="flex items-center justify-center gap-2 mt-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.stepNumber}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={getStepStyle(step) + " cursor-pointer"}
                onClick={() => {
                  setStep(step.stepNumber);
                }}
              >
                {step.displayText}
              </div>
              {step.type === "circle" && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {step.label}
                </span>
              )}
              {step.type === "pill" && (
                <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 select-none">
                  {/* Espaciador invisible para mantener la misma altura que los círculos */}
                  placeholder
                </span>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${getLineStyle(step.stepNumber)}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {currentStep === 0 && "Comienzo • Configuración inicial"}
        {currentStep === 1 && "Paso 1 de 2 • Configuración principal"}
        {currentStep === 2 && "Paso 2 de 2 • Configuración final"}
      </p>
    </div>
  );
};

export default StepIndicator;
