import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { useSCP } from "@/hooks/useSCP";
import type { Turma } from "@/domain/models";

export function TurmasPage() {
  const { turmas, createTurma, updateTurma, deleteTurma } = useSCP();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setError(null);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTurma(null);
    setError(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTurma(null);
    setError(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const nome = formData.get("nome") as string;
    const curso = formData.get("curso") as string;
    const ano = parseInt(formData.get("ano") as string);

    if (!nome || !curso || !ano) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      if (editingTurma) {
        updateTurma(editingTurma.id, { nome, curso, ano });
      } else {
        createTurma({ nome, curso, ano });
      }
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar turma");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) {
      return;
    }

    try {
      deleteTurma(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir turma");
    }
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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Turma</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Ex: Turma A - 2025"
                  defaultValue={editingTurma?.nome}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  name="curso"
                  placeholder="Ex: Ensino Médio"
                  defaultValue={editingTurma?.curso}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano Letivo</Label>
                <Input
                  id="ano"
                  name="ano"
                  type="number"
                  placeholder="2025"
                  defaultValue={editingTurma?.ano}
                  required
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
                <Button type="submit">
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
            {turmas.length} turma(s) cadastrada(s) no sistema
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
              {turmas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma turma cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                turmas.map((turma) => (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(turma.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
