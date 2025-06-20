import { useState } from "react";
import {
  ConfigurationParams,
  ProfessionalProfile,
  configurationSchema,
  formatCurrency,
} from "@/lib/ust-calculator";
import { WizardStep } from "./WizardStep";
import { ProfilesTable } from "./ProfilesTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  DollarSign,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";

interface Stage02ConfigurationProps {
  currentStep: number;
  totalSteps: number;
  configuration: ConfigurationParams;
  professionalProfiles: ProfessionalProfile[];
  onUpdateConfiguration: (configuration: ConfigurationParams) => void;
  onAddProfile: (profile: Omit<ProfessionalProfile, "id">) => void;
  onUpdateProfile: (id: string, updates: Partial<ProfessionalProfile>) => void;
  onDeleteProfile: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export const Stage02Configuration = ({
  currentStep,
  totalSteps,
  configuration,
  professionalProfiles,
  onUpdateConfiguration,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  onNext,
  onPrevious,
  canProceed,
}: Stage02ConfigurationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (
    field: keyof ConfigurationParams,
    value: number,
  ) => {
    const updatedConfig = { ...configuration, [field]: value };
    onUpdateConfiguration(updatedConfig);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateAndProceed = () => {
    const result = configurationSchema.safeParse(configuration);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          fieldErrors[error.path[0]] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  // Calculate some preview values
  const totalHoursContract =
    configuration.contractDurationWeeks * configuration.hoursPerWeek;
  const ustValueFormatted = formatCurrency(configuration.ustUnitValue);

  return (
    <WizardStep
      title="Parâmetros de Configuração"
      description="Configure os valores base para o cálculo UST e gerencie os perfis profissionais"
      currentStep={currentStep}
      totalSteps={totalSteps}
      canProceed={canProceed}
      onNext={validateAndProceed}
      onPrevious={onPrevious}
    >
      <div className="space-y-8">
        {/* Configuration Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Parâmetros Iniciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* UST Unit Value */}
              <div className="space-y-2">
                <Label
                  htmlFor="ustUnitValue"
                  className="flex items-center gap-2 text-base font-medium"
                >
                  <DollarSign className="w-4 h-4 text-primary" />
                  Valor Unitário UST
                </Label>
                <Input
                  id="ustUnitValue"
                  type="number"
                  value={configuration.ustUnitValue}
                  onChange={(e) =>
                    handleFieldChange(
                      "ustUnitValue",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="70.00"
                  min="0.01"
                  step="0.01"
                  className={`ust-input-focus ${errors.ustUnitValue ? "border-destructive" : ""}`}
                />
                {errors.ustUnitValue && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.ustUnitValue}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Valor padrão: R$ 70,00
                </p>
              </div>

              {/* Contract Duration */}
              <div className="space-y-2">
                <Label
                  htmlFor="contractDurationWeeks"
                  className="flex items-center gap-2 text-base font-medium"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  Duração do Contrato (Semanas)
                </Label>
                <Input
                  id="contractDurationWeeks"
                  type="number"
                  value={configuration.contractDurationWeeks}
                  onChange={(e) =>
                    handleFieldChange(
                      "contractDurationWeeks",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="52"
                  min="1"
                  step="1"
                  className={`ust-input-focus ${errors.contractDurationWeeks ? "border-destructive" : ""}`}
                />
                {errors.contractDurationWeeks && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errors.contractDurationWeeks}
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Valor padrão: 52 semanas (1 ano)
                </p>
              </div>

              {/* Hours per Week */}
              <div className="space-y-2">
                <Label
                  htmlFor="hoursPerWeek"
                  className="flex items-center gap-2 text-base font-medium"
                >
                  <Clock className="w-4 h-4 text-primary" />
                  Horas/Semana
                </Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  value={configuration.hoursPerWeek}
                  onChange={(e) =>
                    handleFieldChange(
                      "hoursPerWeek",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="40"
                  min="1"
                  step="0.5"
                  className={`ust-input-focus ${errors.hoursPerWeek ? "border-destructive" : ""}`}
                />
                {errors.hoursPerWeek && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.hoursPerWeek}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Valor padrão: 40 horas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Perfis Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfilesTable
              profiles={professionalProfiles}
              onAdd={onAddProfile}
              onUpdate={onUpdateProfile}
              onDelete={onDeleteProfile}
            />
          </CardContent>
        </Card>
      </div>
    </WizardStep>
  );
};
