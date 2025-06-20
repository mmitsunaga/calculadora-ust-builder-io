import { useState } from "react";
import {
  PersonalInfo,
  personalInfoSchema,
  goiasOrganizations,
} from "@/lib/ust-calculator";
import { WizardStep } from "./WizardStep";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User, Mail, Building } from "lucide-react";

interface Stage01PersonalInfoProps {
  currentStep: number;
  totalSteps: number;
  personalInfo: PersonalInfo;
  onUpdate: (personalInfo: PersonalInfo) => void;
  onNext: () => void;
  canProceed: boolean;
}

export const Stage01PersonalInfo = ({
  currentStep,
  totalSteps,
  personalInfo,
  onUpdate,
  onNext,
  canProceed,
}: Stage01PersonalInfoProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    const updatedInfo = { ...personalInfo, [field]: value };
    onUpdate(updatedInfo);

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
    const result = personalInfoSchema.safeParse(personalInfo);

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

  return (
    <WizardStep
      title="Informações Pessoais"
      description="Preencha seus dados pessoais para começar o cálculo UST"
      currentStep={currentStep}
      totalSteps={totalSteps}
      canProceed={canProceed}
      onNext={validateAndProceed}
    >
      <div className="space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="flex items-center gap-2 text-base font-medium"
          >
            <User className="w-4 h-4 text-primary" />
            Nome Completo
          </Label>
          <Input
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            placeholder="Digite seu nome completo"
            maxLength={255}
            className={`ust-input-focus ${errors.fullName ? "border-destructive" : ""}`}
          />
          {errors.fullName && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.fullName}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            Máximo de 255 caracteres ({personalInfo.fullName.length}/255)
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-base font-medium"
          >
            <Mail className="w-4 h-4 text-primary" />
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="Digite seu e-mail"
            maxLength={50}
            className={`ust-input-focus ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.email}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            Máximo de 50 caracteres ({personalInfo.email.length}/50)
          </p>
        </div>

        {/* Organization Field */}
        <div className="space-y-2">
          <Label
            htmlFor="organization"
            className="flex items-center gap-2 text-base font-medium"
          >
            <Building className="w-4 h-4 text-primary" />
            Organização de Origem
          </Label>
          <Select
            value={personalInfo.organization}
            onValueChange={(value) => handleFieldChange("organization", value)}
          >
            <SelectTrigger
              className={`ust-input-focus ${errors.organization ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Selecione sua organização" />
            </SelectTrigger>
            <SelectContent>
              {goiasOrganizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organization && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.organization}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            Selecione uma organização do Estado de Goiás
          </p>
        </div>
      </div>
    </WizardStep>
  );
};
