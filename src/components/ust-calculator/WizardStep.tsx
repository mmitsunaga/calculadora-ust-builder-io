import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepProps {
  children: ReactNode;
  title: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
  canProceed?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export const WizardStep = ({
  children,
  title,
  description,
  currentStep,
  totalSteps,
  canProceed = true,
  onNext,
  onPrevious,
  className,
}: WizardStepProps) => {
  const showPrevious = currentStep > 1;
  const showNext = currentStep < totalSteps;
  const isLastStep = currentStep === totalSteps;

  return (
    <Card className={cn("w-full max-w-5xl mx-auto ust-card-shadow", className)}>
      <CardContent className="p-8">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-foreground mb-2">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>

        <div className="animate-fade-in">{children}</div>
      </CardContent>

      <CardFooter className="px-8 py-6 bg-muted/20 flex justify-between items-center border-t">
        <div className="flex items-center gap-4">
          {showPrevious && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {currentStep} de {totalSteps}
          </span>
          {showNext && (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              {isLastStep ? "Finalizar" : "Próximo"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
