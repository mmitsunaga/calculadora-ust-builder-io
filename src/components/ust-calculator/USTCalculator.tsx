import { useUSTCalculator } from "@/hooks/use-ust-calculator";
import { ProgressIndicator } from "./ProgressIndicator";
import { Stage01PersonalInfo } from "./Stage01PersonalInfo";
import { Stage02Configuration } from "./Stage02Configuration";
import { Stage03Projects } from "./Stage03Projects";
import { Stage04Squads } from "./Stage04Squads";
import { Stage05Placeholder } from "./Stage05Placeholder";

const STEP_LABELS = [
  "Informações Pessoais",
  "Configuração",
  "Projetos Estimados",
  "Squads de Projeto",
  "Resultados",
];

const TOTAL_STEPS = 5;

export const USTCalculator = () => {
  const {
    data,
    setCurrentStep,
    nextStep,
    previousStep,
    canProceedToNextStep,
    updatePersonalInfo,
    updateConfiguration,
    addProfessionalProfile,
    updateProfessionalProfile,
    deleteProfessionalProfile,
    addProject,
    updateProject,
    deleteProject,
    updateSquadMemberQuantity,
    initializeSquadMembers,
    reset,
  } = useUSTCalculator();

  const renderCurrentStep = () => {
    switch (data.currentStep) {
      case 1:
        return (
          <Stage01PersonalInfo
            currentStep={data.currentStep}
            totalSteps={TOTAL_STEPS}
            personalInfo={data.personalInfo}
            onUpdate={updatePersonalInfo}
            onNext={nextStep}
            canProceed={canProceedToNextStep}
          />
        );

      case 2:
        return (
          <Stage02Configuration
            currentStep={data.currentStep}
            totalSteps={TOTAL_STEPS}
            configuration={data.configuration}
            professionalProfiles={data.professionalProfiles}
            onUpdateConfiguration={updateConfiguration}
            onAddProfile={addProfessionalProfile}
            onUpdateProfile={updateProfessionalProfile}
            onDeleteProfile={deleteProfessionalProfile}
            onNext={nextStep}
            onPrevious={previousStep}
            canProceed={canProceedToNextStep}
          />
        );

      case 3:
        return (
          <Stage03Projects
            currentStep={data.currentStep}
            totalSteps={TOTAL_STEPS}
            projects={data.projects}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onNext={nextStep}
            onPrevious={previousStep}
            canProceed={canProceedToNextStep}
          />
        );

      case 4:
        return (
          <Stage04Squads
            currentStep={data.currentStep}
            totalSteps={TOTAL_STEPS}
            data={data}
            onUpdateSquadMemberQuantity={updateSquadMemberQuantity}
            onInitializeSquadMembers={initializeSquadMembers}
            onNext={nextStep}
            onPrevious={previousStep}
            canProceed={canProceedToNextStep}
          />
        );

      case 5:
        return (
          <Stage05Placeholder
            currentStep={data.currentStep}
            totalSteps={TOTAL_STEPS}
            onPrevious={previousStep}
            onReset={reset}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="ust-calculator-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Calculadora UST
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Planejamento de Demanda para Unidade de Serviço Técnico
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={data.currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />

        {/* Current Step Content */}
        <div className="mt-8">{renderCurrentStep()}</div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <details>
              <summary className="cursor-pointer font-semibold">
                Debug Info (Dev Only)
              </summary>
              <pre className="mt-2 overflow-auto">
                {JSON.stringify(
                  {
                    currentStep: data.currentStep,
                    canProceed: canProceedToNextStep,
                    personalInfoFilled: !!(
                      data.personalInfo.fullName &&
                      data.personalInfo.email &&
                      data.personalInfo.organization
                    ),
                    profilesCount: data.professionalProfiles.length,
                    projectsCount: data.projects.length,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
