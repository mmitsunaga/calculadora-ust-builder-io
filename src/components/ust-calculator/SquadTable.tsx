import {
  SquadTable as SquadTableType,
  ConfigurationParams,
  getComplexityLabel,
  getComplexityColor,
  formatCurrency,
  formatNumber,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calculator, DollarSign, Clock } from "lucide-react";

interface SquadTableProps {
  squad: SquadTableType;
  configuration: ConfigurationParams;
  onUpdateQuantity: (profileId: string, quantity: number) => void;
}

export const SquadTable = ({
  squad,
  configuration,
  onUpdateQuantity,
}: SquadTableProps) => {
  // Calculate totals
  const totals = squad.members.reduce(
    (acc, member) => {
      acc.totalUST += member.totalUst;
      acc.totalReais += member.totalReais;
      acc.ustPerWeek += member.ustPerWeek;
      acc.reaisPerWeek += member.reaisPerWeek;
      acc.totalQuantity += member.quantity;
      return acc;
    },
    {
      totalUST: 0,
      totalReais: 0,
      ustPerWeek: 0,
      reaisPerWeek: 0,
      totalQuantity: 0,
    },
  );

  const complexityLabel = getComplexityLabel(squad.complexity);
  const complexityColor = getComplexityColor(squad.complexity);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Squad Padrão - Projetos - {complexityLabel}
          </CardTitle>
          <Badge variant="outline" className={complexityColor}>
            {squad.totalDurationWeeks} semanas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {squad.totalDurationWeeks === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">
              Nenhum projeto de complexidade {complexityLabel.toLowerCase()}{" "}
              definido
            </p>
            <p className="text-sm">
              Adicione projetos na etapa anterior para configurar este squad
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    Total Profissionais
                  </span>
                </div>
                <p className="text-xl font-bold text-primary">
                  {totals.totalQuantity}
                </p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">UST Total</span>
                </div>
                <p className="text-xl font-bold text-accent">
                  {formatNumber(totals.totalUST, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Custo Total</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totals.totalReais)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Custo/Semana</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(totals.reaisPerWeek)}
                </p>
              </div>
            </div>

            {/* Squad Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="ust-table-header">
                    <TableHead className="font-semibold">
                      Perfil Profissional
                    </TableHead>
                    <TableHead className="font-semibold w-20 text-center">
                      FCP
                    </TableHead>
                    <TableHead className="font-semibold w-24 text-center">
                      Qtd.
                    </TableHead>
                    <TableHead className="font-semibold w-24 text-center">
                      UST/Sem.
                    </TableHead>
                    <TableHead className="font-semibold w-32 text-center">
                      R$/Sem.
                    </TableHead>
                    <TableHead className="font-semibold w-24 text-center">
                      Total UST
                    </TableHead>
                    <TableHead className="font-semibold w-32 text-center">
                      Total R$
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squad.members
                    .filter((member) => member.quantity > 0)
                    .map((member) => (
                      <TableRow key={member.profileId}>
                        <TableCell className="font-medium">
                          {member.profileName}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumber(member.fcp, 1)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={member.quantity}
                            onChange={(e) =>
                              onUpdateQuantity(
                                member.profileId,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min="0"
                            className="w-16 h-8 text-center ust-input-focus"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumber(member.ustPerWeek, 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(member.reaisPerWeek)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumber(member.totalUst, 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(member.totalReais)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Show profiles with 0 quantity in a collapsed section */}
                  {squad.members
                    .filter((member) => member.quantity === 0)
                    .map((member) => (
                      <TableRow
                        key={member.profileId}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          {member.profileName}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatNumber(member.fcp, 1)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={member.quantity}
                            onChange={(e) =>
                              onUpdateQuantity(
                                member.profileId,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min="0"
                            className="w-16 h-8 text-center ust-input-focus"
                          />
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          -
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          -
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          -
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          -
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                {totals.totalQuantity > 0 && (
                  <TableFooter>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>TOTAIS</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-center">
                        {totals.totalQuantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.ustPerWeek, 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(totals.reaisPerWeek)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.totalUST, 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(totals.totalReais)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>

            {/* Calculation Info */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h5 className="font-semibold mb-2">Fórmulas de Cálculo:</h5>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>UST/Semana:</strong> FCP × Quantidade × Horas/Semana (
                  {configuration.hoursPerWeek}h)
                </p>
                <p>
                  <strong>R$/Semana:</strong> UST/Semana × Valor UST (
                  {formatCurrency(configuration.ustUnitValue)})
                </p>
                <p>
                  <strong>Total UST:</strong> UST/Semana × Duração (
                  {squad.totalDurationWeeks} semanas)
                </p>
                <p>
                  <strong>Total R$:</strong> R$/Semana × Duração (
                  {squad.totalDurationWeeks} semanas)
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
