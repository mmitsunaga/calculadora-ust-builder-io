import { useEffect } from "react";
import {
  USTCalculatorData,
  ConfigurationParams,
  ProjectComplexity,
} from "@/lib/ust-calculator";
import { WizardStep } from "./WizardStep";
import { SquadTable } from "./SquadTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, RefreshCw } from "lucide-react";

interface Stage04SquadsProps {
  currentStep: number;
  totalSteps: number;
  data: USTCalculatorData;
  onUpdateSquadMemberQuantity: (
    complexity: ProjectComplexity,
    profileId: string,
    quantity: number,
  ) => void;
  onInitializeSquadMembers: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export const Stage04Squads = ({
  currentStep,
  totalSteps,
  data,
  onUpdateSquadMemberQuantity,
  onInitializeSquadMembers,
  onNext,
  onPrevious,
  canProceed,
}: Stage04SquadsProps) => {
  const { squads, configuration, professionalProfiles, projects } = data;

  // Initialize squad members when entering this stage
  useEffect(() => {
    // Check if squads need to be initialized
    const needsInit = Object.values(squads).some(
      (squad) => squad.members.length !== professionalProfiles.length,
    );

    if (needsInit) {
      onInitializeSquadMembers();
    }
  }, [squads, professionalProfiles, onInitializeSquadMembers]);

  const hasProjects = projects.length > 0;
  const hasProfiles = professionalProfiles.length > 0;

  if (!hasProfiles) {
    return (
      <WizardStep
        title="Squads de Projeto"
        description="Configure a demanda de profissionais por complexidade de projeto"
        currentStep={currentStep}
        totalSteps={totalSteps}
        canProceed={canProceed}
        onNext={onNext}
        onPrevious={onPrevious}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Nenhum perfil profissional foi configurado na Etapa 2. É
              necessário ter pelo menos um perfil para configurar os squads.
            </span>
            <Button variant="outline" onClick={onPrevious}>
              Voltar à Etapa 2
            </Button>
          </AlertDescription>
        </Alert>
      </WizardStep>
    );
  }

  return (
    <WizardStep
      title="Squads de Projeto"
      description="Configure a quantidade de profissionais necessários para cada complexidade de projeto"
      currentStep={currentStep}
      totalSteps={totalSteps}
      canProceed={canProceed}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary mb-2">
                Configuração de Squads
              </h4>
              <p className="text-sm text-muted-foreground">
                Para cada complexidade de projeto, defina quantos profissionais
                de cada perfil serão necessários. As durações são calculadas
                automaticamente baseadas nos projetos adicionados na etapa
                anterior.
              </p>
              {!hasProjects && (
                <p className="text-sm text-warning mt-2">
                  <strong>Nota:</strong> Nenhum projeto foi definido na etapa
                  anterior. Você ainda pode configurar os squads, mas as
                  durações estarão zeradas.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onInitializeSquadMembers}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar Squads com Perfis Atuais
          </Button>
        </div>

        {/* Squad Tables */}
        <div className="space-y-6">
          <SquadTable
            squad={squads.low}
            configuration={configuration}
            onUpdateQuantity={(profileId, quantity) =>
              onUpdateSquadMemberQuantity("low", profileId, quantity)
            }
          />

          <SquadTable
            squad={squads.medium}
            configuration={configuration}
            onUpdateQuantity={(profileId, quantity) =>
              onUpdateSquadMemberQuantity("medium", profileId, quantity)
            }
          />

          <SquadTable
            squad={squads.high}
            configuration={configuration}
            onUpdateQuantity={(profileId, quantity) =>
              onUpdateSquadMemberQuantity("high", profileId, quantity)
            }
          />
        </div>

        {/* Summary Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> Os cálculos são atualizados automaticamente
            conforme você altera as quantidades. Use os valores de FCP dos
            perfis profissionais e a configuração da Etapa 2 para determinar
            custos e demanda UST. Você pode deixar alguns perfis com quantidade
            zero se não forem necessários para determinada complexidade.
          </AlertDescription>
        </Alert>
      </div>
    </WizardStep>
  );
};
