import { useState } from "react";
import {
  ProfessionalProfile,
  professionalProfileSchema,
} from "@/lib/ust-calculator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  User,
  Calculator,
} from "lucide-react";
import { formatNumber } from "@/lib/ust-calculator";

interface ProfilesTableProps {
  profiles: ProfessionalProfile[];
  onAdd: (profile: Omit<ProfessionalProfile, "id">) => void;
  onUpdate: (id: string, updates: Partial<ProfessionalProfile>) => void;
  onDelete: (id: string) => void;
}

export const ProfilesTable = ({
  profiles,
  onAdd,
  onUpdate,
  onDelete,
}: ProfilesTableProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] =
    useState<ProfessionalProfile | null>(null);
  const [formData, setFormData] = useState({
    profileName: "",
    fcp: 1.0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAddDialog = () => {
    setFormData({ profileName: "", fcp: 1.0 });
    setErrors({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (profile: ProfessionalProfile) => {
    setFormData({
      profileName: profile.profileName,
      fcp: profile.fcp,
    });
    setErrors({});
    setEditingProfile(profile);
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setEditingProfile(null);
    setFormData({ profileName: "", fcp: 1.0 });
    setErrors({});
  };

  const validateAndSubmit = () => {
    const result = professionalProfileSchema
      .omit({ id: true })
      .safeParse(formData);

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

    if (editingProfile) {
      onUpdate(editingProfile.id, formData);
    } else {
      onAdd(formData);
    }

    handleCloseDialogs();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este perfil profissional?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Perfis Profissionais</h4>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenAddDialog}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Perfil Profissional</DialogTitle>
            </DialogHeader>
            <ProfileForm
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
              <TableHead className="font-semibold">
                Perfil Profissional
              </TableHead>
              <TableHead className="font-semibold w-32">FCP</TableHead>
              <TableHead className="font-semibold w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum perfil profissional adicionado ainda.
                  <br />
                  Clique em "Novo Perfil" para começar.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {profile.profileName}
                  </TableCell>
                  <TableCell>{formatNumber(profile.fcp, 1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditDialog(profile)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(profile.id)}
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
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Total de perfis: {profiles.length}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProfile}
        onOpenChange={() => setEditingProfile(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil Profissional</DialogTitle>
          </DialogHeader>
          <ProfileForm
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

interface ProfileFormProps {
  formData: { profileName: string; fcp: number };
  errors: Record<string, string>;
  onChange: (data: { profileName: string; fcp: number }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProfileForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) => {
  const handleFieldChange = (field: string, value: string | number) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profileName" className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Perfil Profissional
        </Label>
        <Input
          id="profileName"
          value={formData.profileName}
          onChange={(e) => handleFieldChange("profileName", e.target.value)}
          placeholder="Ex: Desenvolvedor de Software Sênior"
          maxLength={100}
          className="ust-input-focus"
        />
        {errors.profileName && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.profileName}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fcp" className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          FCP (Fator de Conversão de Produtividade)
        </Label>
        <Input
          id="fcp"
          type="number"
          value={formData.fcp}
          onChange={(e) =>
            handleFieldChange("fcp", parseFloat(e.target.value) || 0)
          }
          placeholder="1.0"
          min="0.1"
          max="10"
          step="0.1"
          className="ust-input-focus"
        />
        {errors.fcp && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.fcp}</AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-muted-foreground">Valor entre 0.1 e 10.0</p>
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
