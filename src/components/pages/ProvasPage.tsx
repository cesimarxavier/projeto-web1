import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Pencil, Trash2, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";

interface Prova {
  id: number;
  titulo: string;
  data: string;
  turma: string;
  numeroQuestoes: number;
  status: "pendente" | "concluida";
  gabarito?: string[];
}

const provasData: Prova[] = [
  { 
    id: 1, 
    titulo: "Prova de Matemática - 1º Bimestre", 
    data: "2025-10-28", 
    turma: "Turma A",
    numeroQuestoes: 10,
    status: "concluida",
    gabarito: ["A", "B", "C", "D", "E", "A", "B", "C", "D", "E"]
  },
  { 
    id: 2, 
    titulo: "Prova de Português - 1º Bimestre", 
    data: "2025-10-25", 
    turma: "Turma B",
    numeroQuestoes: 15,
    status: "concluida",
    gabarito: ["A", "B", "C", "D", "E", "A", "B", "C", "D", "E", "A", "B", "C", "D", "E"]
  },
  { 
    id: 3, 
    titulo: "Prova de História - 2º Bimestre", 
    data: "2025-11-10", 
    turma: "Turma C",
    numeroQuestoes: 12,
    status: "pendente"
  },
  { 
    id: 4, 
    titulo: "Prova de Geografia - 2º Bimestre", 
    data: "2025-11-15", 
    turma: "Turma D",
    numeroQuestoes: 8,
    status: "pendente"
  },
];

const alternativas = ["A", "B", "C", "D", "E"];

export function ProvasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGabaritoOpen, setIsGabaritoOpen] = useState(false);
  const [editingProva, setEditingProva] = useState<Prova | null>(null);
  const [currentProva, setCurrentProva] = useState<Prova | null>(null);
  const [numeroQuestoes, setNumeroQuestoes] = useState<number>(10);
  const [gabarito, setGabarito] = useState<string[]>([]);

  const handleEdit = (prova: Prova) => {
    setEditingProva(prova);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProva(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProva(null);
  };

  const handleOpenGabarito = (prova: Prova) => {
    setCurrentProva(prova);
    setNumeroQuestoes(prova.numeroQuestoes);
    
    // Inicializa o gabarito com as respostas existentes ou vazio
    if (prova.gabarito && prova.gabarito.length === prova.numeroQuestoes) {
      setGabarito(prova.gabarito);
    } else {
      setGabarito(new Array(prova.numeroQuestoes).fill(""));
    }
    
    setIsGabaritoOpen(true);
  };

  const handleCloseGabarito = () => {
    setIsGabaritoOpen(false);
    setCurrentProva(null);
    setGabarito([]);
  };

  const handleSelectResposta = (questaoIndex: number, alternativa: string) => {
    const novoGabarito = [...gabarito];
    novoGabarito[questaoIndex] = alternativa;
    setGabarito(novoGabarito);
  };

  const questoesPreenchidas = gabarito.filter(r => r !== "").length;
  const gabaritoCompleto = questoesPreenchidas === numeroQuestoes;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Provas</h1>
          <p className="text-muted-foreground">
            Cadastre provas e configure seus gabaritos
          </p>
        </div>

        {/* Nova Prova Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Prova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProva ? "Editar Prova" : "Nova Prova"}
              </DialogTitle>
              <DialogDescription>
                {editingProva
                  ? "Edite as informações da prova"
                  : "Preencha os dados para cadastrar uma nova prova"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Prova</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Prova de Matemática - 1º Bimestre"
                  defaultValue={editingProva?.titulo}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data da Aplicação</Label>
                <Input
                  id="data"
                  type="date"
                  defaultValue={editingProva?.data}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma</Label>
                <Select defaultValue={editingProva?.turma}>
                  <SelectTrigger id="turma">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Turma A">Turma A</SelectItem>
                    <SelectItem value="Turma B">Turma B</SelectItem>
                    <SelectItem value="Turma C">Turma C</SelectItem>
                    <SelectItem value="Turma D">Turma D</SelectItem>
                    <SelectItem value="Turma E">Turma E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questoes">Número de Questões</Label>
                <Input
                  id="questoes"
                  type="number"
                  min="1"
                  max="50"
                  placeholder="10"
                  defaultValue={editingProva?.numeroQuestoes}
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
                  {editingProva ? "Salvar Alterações" : "Cadastrar Prova"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Provas</CardTitle>
          <CardDescription>
            {provasData.length} prova(s) cadastrada(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Questões</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provasData.map((prova) => (
                <TableRow key={prova.id}>
                  <TableCell>{prova.titulo}</TableCell>
                  <TableCell>
                    {new Date(prova.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{prova.turma}</TableCell>
                  <TableCell>{prova.numeroQuestoes}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={prova.status === "concluida" ? "default" : "secondary"}
                    >
                      {prova.status === "concluida" ? "Concluída" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenGabarito(prova)}
                        title="Configurar Gabarito"
                      >
                        <FileCheck className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(prova)}
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

      {/* Gabarito Dialog */}
      <Dialog open={isGabaritoOpen} onOpenChange={setIsGabaritoOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Gabarito</DialogTitle>
            <DialogDescription>
              {currentProva?.titulo} - {currentProva?.turma}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Status do Gabarito */}
            {!gabaritoCompleto ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Preencha todas as {numeroQuestoes} questões. 
                  Atualmente {questoesPreenchidas} de {numeroQuestoes} questões preenchidas.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-success bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Gabarito completo! Todas as {numeroQuestoes} questões foram preenchidas.
                </AlertDescription>
              </Alert>
            )}

            {/* Grid de Questões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: numeroQuestoes }, (_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>Questão {index + 1}</span>
                      {gabarito[index] && (
                        <Badge variant="default">
                          Resposta: {gabarito[index]}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {alternativas.map((alt) => (
                        <Button
                          key={alt}
                          variant={gabarito[index] === alt ? "default" : "outline"}
                          size="lg"
                          className="flex-1"
                          onClick={() => handleSelectResposta(index, alt)}
                        >
                          {alt}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseGabarito}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                onClick={handleCloseGabarito}
                disabled={!gabaritoCompleto}
              >
                Salvar Gabarito
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
