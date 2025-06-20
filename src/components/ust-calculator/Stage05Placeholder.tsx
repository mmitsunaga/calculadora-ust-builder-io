import { WizardStep } from "./WizardStep";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Download, Mail, BarChart3 } from "lucide-react";

interface Stage05PlaceholderProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onReset: () => void;
}

export const Stage05Placeholder = ({
  currentStep,
  totalSteps,
  onPrevious,
  onReset,
}: Stage05PlaceholderProps) => {
  const handleExport = () => {
    // Placeholder for export functionality
    alert("Funcionalidade de exportação será implementada em breve!");
  };

  const handleEmailReport = () => {
    // Placeholder for email functionality
    alert("Funcionalidade de envio por e-mail será implementada em breve!");
  };

  return (
    <WizardStep
      title="Cálculo Concluído"
      description="Sua configuração UST foi finalizada com sucesso"
      currentStep={currentStep}
      totalSteps={totalSteps}
      canProceed={false}
      onPrevious={onPrevious}
    >
      <div className="space-y-8">
        {/* Success Message */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Parabéns!</h3>
          <p className="text-muted-foreground text-lg">
            Você completou todas as etapas do cálculo UST
          </p>
        </div>

        {/* Placeholder Content */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Nota:</strong> Esta é uma tela de placeholder. Em uma
            implementação completa, aqui seria exibido um resumo detalhado dos
            cálculos, relatórios e opções de exportação.
          </AlertDescription>
        </Alert>

        {/* Future Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Relatório de Resultados</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Visualização completa dos cálculos UST, custos por complexidade
                e demanda de profissionais.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Resumo executivo</p>
                <p>• Custos por squad</p>
                <p>• Distribuição de profissionais</p>
                <p>• Gráficos e métricas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Exportação</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Exporte os resultados em diferentes formatos para
                compartilhamento.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Relatório em PDF</p>
                <p>• Planilha Excel</p>
                <p>• Dados em JSON</p>
                <p>• Apresentação PowerPoint</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Resultados
          </Button>
          <Button variant="outline" onClick={handleEmailReport}>
            <Mail className="w-4 h-4 mr-2" />
            Enviar por E-mail
          </Button>
          <Button onClick={onReset} variant="default">
            <FileText className="w-4 h-4 mr-2" />
            Novo Cálculo
          </Button>
        </div>

        {/* Implementation Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Para Desenvolvedores:</strong> Esta etapa pode ser expandida
            para incluir relatórios detalhados, gráficos interativos,
            funcionalidades de exportação, integração com APIs externas, e muito
            mais conforme as necessidades do projeto.
          </p>
        </div>
      </div>
    </WizardStep>
  );
};
