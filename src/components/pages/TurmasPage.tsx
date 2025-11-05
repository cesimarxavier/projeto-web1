import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Turma {
  id: number;
  nome: string;
  curso: string;
  ano: number;
}

const turmasData: Turma[] = [
  { id: 1, nome: "Turma A", curso: "Ensino Médio", ano: 2025 },
  { id: 2, nome: "Turma B", curso: "Ensino Médio", ano: 2025 },
  { id: 3, nome: "Turma C", curso: "Ensino Fundamental II", ano: 2025 },
  { id: 4, nome: "Turma D", curso: "Ensino Médio", ano: 2025 },
  { id: 5, nome: "Turma E", curso: "Ensino Fundamental II", ano: 2025 },
];

export function TurmasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTurma(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTurma(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Turmas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie as turmas do sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTurma ? "Editar Turma" : "Nova Turma"}
              </DialogTitle>
              <DialogDescription>
                {editingTurma
                  ? "Edite as informações da turma"
                  : "Preencha os dados para cadastrar uma nova turma"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Turma</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Turma A - 2025"
                  defaultValue={editingTurma?.nome}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  placeholder="Ex: Ensino Médio"
                  defaultValue={editingTurma?.curso}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano Letivo</Label>
                <Input
                  id="ano"
                  type="number"
                  placeholder="2025"
                  defaultValue={editingTurma?.ano}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleCloseDialog}>
                  {editingTurma ? "Salvar Alterações" : "Cadastrar Turma"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            {turmasData.length} turma(s) cadastrada(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmasData.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell>{turma.nome}</TableCell>
                  <TableCell>{turma.curso}</TableCell>
                  <TableCell>{turma.ano}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(turma)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
