import { useState } from "react";
import {
  Project,
  projectSchema,
  getComplexityLabel,
  getComplexityColor,
} from "@/lib/ust-calculator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  FolderPlus,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ProjectsTableProps {
  projects: Project[];
  onAdd: (project: Omit<Project, "id">) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

export const ProjectsTable = ({
  projects,
  onAdd,
  onUpdate,
  onDelete,
}: ProjectsTableProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    complexity: "low" as const,
    durationWeeks: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAddDialog = () => {
    setFormData({ name: "", complexity: "low" as const, durationWeeks: 1 });
    setErrors({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      complexity: project.complexity,
      durationWeeks: project.durationWeeks,
    });
    setErrors({});
    setEditingProject(project);
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: "", complexity: "low" as const, durationWeeks: 1 });
    setErrors({});
  };

  const validateAndSubmit = () => {
    const result = projectSchema.omit({ id: true }).safeParse(formData);

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

    if (editingProject) {
      onUpdate(editingProject.id, formData);
    } else {
      onAdd(formData);
    }

    handleCloseDialogs();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      onDelete(id);
    }
  };

  // Calculate totals
  const totalProjects = projects.length;
  const totalDuration = projects.reduce(
    (sum, project) => sum + project.durationWeeks,
    0,
  );
  const complexityCount = projects.reduce(
    (acc, project) => {
      acc[project.complexity]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 },
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Projetos Estimados</h4>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenAddDialog}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Projeto</DialogTitle>
            </DialogHeader>
            <ProjectForm
              formData={formData}
              errors={errors}
              onChange={setFormData}
              onSubmit={validateAndSubmit}
              onCancel={handleCloseDialogs}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="ust-table-header">
              <TableHead className="font-semibold">Nome do Projeto</TableHead>
              <TableHead className="font-semibold w-32">Complexidade</TableHead>
              <TableHead className="font-semibold w-32">
                Duração (sem.)
              </TableHead>
              <TableHead className="font-semibold w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum projeto adicionado ainda.
                  <br />
                  Clique em "Novo Projeto" para começar.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getComplexityColor(project.complexity)}
                    >
                      {getComplexityLabel(project.complexity)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {project.durationWeeks}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditDialog(project)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {projects.length > 0 && (
            <TableFooter>
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">
                  Total: {totalProjects} projeto{totalProjects !== 1 ? "s" : ""}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {complexityCount.low > 0 && (
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50 border-green-200 text-xs"
                      >
                        {complexityCount.low} Baixa
                      </Badge>
                    )}
                    {complexityCount.medium > 0 && (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 bg-yellow-50 border-yellow-200 text-xs"
                      >
                        {complexityCount.medium} Média
                      </Badge>
                    )}
                    {complexityCount.high > 0 && (
                      <Badge
                        variant="outline"
                        className="text-red-600 bg-red-50 border-red-200 text-xs"
                      >
                        {complexityCount.high} Alta
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-center">
                  {totalDuration} sem.
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProject}
        onOpenChange={() => setEditingProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <ProjectForm
            formData={formData}
            errors={errors}
            onChange={setFormData}
            onSubmit={validateAndSubmit}
            onCancel={handleCloseDialogs}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProjectFormProps {
  formData: {
    name: string;
    complexity: "low" | "medium" | "high";
    durationWeeks: number;
  };
  errors: Record<string, string>;
  onChange: (data: {
    name: string;
    complexity: "low" | "medium" | "high";
    durationWeeks: number;
  }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProjectForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  const handleFieldChange = (field: string, value: string | number) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectName" className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-primary" />
          Nome do Projeto
        </Label>
        <Input
          id="projectName"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="Ex: Sistema de Gestão Integrada"
          maxLength={50}
          className="ust-input-focus"
        />
        {errors.name && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.name}</AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-muted-foreground">
          Máximo de 50 caracteres ({formData.name.length}/50)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="complexity" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Complexidade
        </Label>
        <Select
          value={formData.complexity}
          onValueChange={(value) => handleFieldChange("complexity", value)}
        >
          <SelectTrigger className="ust-input-focus">
            <SelectValue placeholder="Selecione a complexidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
        {errors.complexity && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.complexity}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationWeeks" className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Duração (em semanas)
        </Label>
        <Input
          id="durationWeeks"
          type="number"
          value={formData.durationWeeks}
          onChange={(e) =>
            handleFieldChange("durationWeeks", parseInt(e.target.value) || 1)
          }
          placeholder="1"
          min="1"
          step="1"
          className="ust-input-focus"
        />
        {errors.durationWeeks && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.durationWeeks}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>Salvar</Button>
      </div>
    </div>
  );
};
