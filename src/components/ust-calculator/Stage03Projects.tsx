import {
  Project,
  calculateProjectDurationByComplexity,
} from "@/lib/ust-calculator";
import { WizardStep } from "./WizardStep";
import { ProjectsTable } from "./ProjectsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  BarChart3,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Stage03ProjectsProps {
  currentStep: number;
  totalSteps: number;
  projects: Project[];
  onAddProject: (project: Omit<Project, "id">) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export const Stage03Projects = ({
  currentStep,
  totalSteps,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onNext,
  onPrevious,
  canProceed,
}: Stage03ProjectsProps) => {
  const projectsByComplexity = calculateProjectDurationByComplexity(projects);
  const totalProjects = projects.length;
  const totalDuration = projects.reduce(
    (sum, project) => sum + project.durationWeeks,
    0,
  );

  const complexityStats = [
    {
      complexity: "low",
      label: "Baixa",
      count: projects.filter((p) => p.complexity === "low").length,
      duration: projectsByComplexity.low,
      color: "text-green-600 bg-green-50 border-green-200",
      bgColor: "bg-green-50",
    },
    {
      complexity: "medium",
      label: "Média",
      count: projects.filter((p) => p.complexity === "medium").length,
      duration: projectsByComplexity.medium,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      bgColor: "bg-yellow-50",
    },
    {
      complexity: "high",
      label: "Alta",
      count: projects.filter((p) => p.complexity === "high").length,
      duration: projectsByComplexity.high,
      color: "text-red-600 bg-red-50 border-red-200",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <WizardStep
      title="Projetos Estimados"
      description="Defina os projetos que serão considerados no cálculo UST"
      currentStep={currentStep}
      totalSteps={totalSteps}
      canProceed={canProceed}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Projetos
                  </p>
                  <p className="text-2xl font-bold">{totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duração Total</p>
                  <p className="text-2xl font-bold">
                    {totalDuration}{" "}
                    <span className="text-sm font-normal">semanas</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mais Comum</p>
                  <p className="text-lg font-bold">
                    {complexityStats.reduce((prev, current) =>
                      prev.count > current.count ? prev : current,
                    ).label || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Média/Projeto</p>
                  <p className="text-2xl font-bold">
                    {totalProjects > 0
                      ? Math.round(totalDuration / totalProjects)
                      : 0}{" "}
                    <span className="text-sm font-normal">sem.</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complexity Breakdown */}
        {totalProjects > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Distribuição por Complexidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complexityStats.map((stat) => (
                  <div
                    key={stat.complexity}
                    className={`p-4 rounded-lg border ${stat.bgColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={stat.color}>
                        {stat.label}
                      </Badge>
                      <span className="text-lg font-bold">{stat.count}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.duration} semanas de duração total
                    </p>
                    {totalProjects > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-white rounded-full h-2">
                          <div
                            className="bg-current h-2 rounded-full"
                            style={{
                              width: `${(stat.count / totalProjects) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round((stat.count / totalProjects) * 100)}% dos
                          projetos
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectsTable
              projects={projects}
              onAdd={onAddProject}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
            />
          </CardContent>
        </Card>

        {/* Information Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Nota:</strong> Os projetos definidos aqui serão utilizados
            para calcular a demanda de profissionais nas próximas etapas. Você
            pode adicionar projetos mesmo que ainda não tenha certeza dos
            detalhes - é possível ajustar depois.
          </AlertDescription>
        </Alert>
      </div>
    </WizardStep>
  );
};
