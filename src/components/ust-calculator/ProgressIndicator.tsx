import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressIndicatorProps) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-muted"></div>
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          ></div>

          <div className="relative flex justify-between">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300",
                      {
                        "ust-step-completed border-accent": isCompleted,
                        "ust-step-active border-primary": isCurrent,
                        "ust-step-inactive border-muted-foreground/30":
                          !isCompleted && !isCurrent,
                      },
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium text-center max-w-20 leading-tight transition-colors duration-300",
                      {
                        "text-accent": isCompleted,
                        "text-primary": isCurrent,
                        "text-muted-foreground": !isCompleted && !isCurrent,
                      },
                    )}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Etapa {currentStep} de {totalSteps}
          </h2>
          <p className="text-muted-foreground">{stepLabels[currentStep - 1]}</p>
        </div>
      </div>
    </div>
  );
};
