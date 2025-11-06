import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileText, Trophy, TrendingUp, Target, BarChart3, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useSCP } from "@/hooks/useSCP";

const chartConfig = {
  media: {
    label: "Média",
    color: "hsl(var(--primary))",
  },
  percentual: {
    label: "Percentual de Acerto",
    color: "hsl(var(--success))",
  },
};

export function RelatoriosPage() {
  const { provas, turmas, alunos, totals, listRespostasByProva, getGabaritoByProva } = useSCP();

  const getTurmaName = useCallback((turmaId: string) => {
    return turmas.find(t => t.id === turmaId)?.nome || turmaId;
  }, [turmas]);

  // Get all respostas with notas
  const allRespostasComNotas = useMemo(() => {
    return provas.flatMap(prova => {
      const respostas = listRespostasByProva(prova.id);
      return respostas.filter(r => typeof r.nota === "number");
    });
  }, [provas, listRespostasByProva]);

  // Calculate taxa de aprovação (notas >= 6)
  const taxaAprovacao = useMemo(() => {
    if (allRespostasComNotas.length === 0) return 0;
    const aprovados = allRespostasComNotas.filter(r => (r.nota || 0) >= 6).length;
    return (aprovados / allRespostasComNotas.length) * 100;
  }, [allRespostasComNotas]);

  // Calculate alunos avaliados (unique alunos with notas)
  const alunosAvaliados = useMemo(() => {
    const alunoIds = new Set(allRespostasComNotas.map(r => r.alunoId));
    return alunoIds.size;
  }, [allRespostasComNotas]);

  // Média por turma
  const mediaPorTurma = useMemo(() => {
    return totals.mediasPorTurma.map(item => {
      const turma = turmas.find(t => t.id === item.turmaId);
      return {
        turma: turma ? turma.nome : item.turmaId,
        media: item.media
      };
    });
  }, [totals.mediasPorTurma, turmas]);

  // Distribuição de notas
  const distribuicaoNotas = useMemo(() => {
    const faixas = [
      { faixa: "0-2.9", min: 0, max: 2.9, color: "hsl(var(--destructive))" },
      { faixa: "3-5.9", min: 3, max: 5.9, color: "hsl(var(--warning))" },
      { faixa: "6-7.9", min: 6, max: 7.9, color: "hsl(var(--info))" },
      { faixa: "8-10", min: 8, max: 10, color: "hsl(var(--success))" },
    ];

    return faixas.map(faixa => ({
      ...faixa,
      quantidade: allRespostasComNotas.filter(
        r => (r.nota || 0) >= faixa.min && (r.nota || 0) <= faixa.max
      ).length
    }));
  }, [allRespostasComNotas]);

  // Acerto por questão (across all provas)
  const acertoPorQuestao = useMemo(() => {
    const questaoStats: Record<number, { acertos: number; total: number }> = {};

    provas.forEach(prova => {
      const gabarito = getGabaritoByProva(prova.id);
      if (!gabarito) return;

      const respostas = listRespostasByProva(prova.id);
      respostas.forEach(resp => {
        resp.respostas.forEach((respostaAluno, idx) => {
          const gabResp = gabarito.respostas[idx];
          if (gabResp === "N") return;

          if (!questaoStats[idx]) {
            questaoStats[idx] = { acertos: 0, total: 0 };
          }

          questaoStats[idx].total++;
          if (respostaAluno === gabResp) {
            questaoStats[idx].acertos++;
          }
        });
      });
    });

    return Object.entries(questaoStats)
      .map(([idx, stats]) => ({
        questao: `Q${parseInt(idx) + 1}`,
        percentual: stats.total > 0 ? (stats.acertos / stats.total) * 100 : 0
      }))
      .sort((a, b) => parseInt(a.questao.slice(1)) - parseInt(b.questao.slice(1)));
  }, [provas, getGabaritoByProva, listRespostasByProva]);

  // Ranking de alunos
  const rankingAlunos = useMemo(() => {
    // Calculate average nota per aluno across all provas
    const alunoNotas: Record<string, { notas: number[]; alunoId: string }> = {};

    allRespostasComNotas.forEach(resp => {
      if (!alunoNotas[resp.alunoId]) {
        alunoNotas[resp.alunoId] = { notas: [], alunoId: resp.alunoId };
      }
      if (typeof resp.nota === "number") {
        alunoNotas[resp.alunoId].notas.push(resp.nota);
      }
    });

    const ranking = Object.values(alunoNotas)
      .map(({ alunoId, notas }) => {
        const aluno = alunos.find(a => a.id === alunoId);
        if (!aluno || notas.length === 0) return null;

        const mediaNota = notas.reduce((acc, n) => acc + n, 0) / notas.length;
        const percentual = (mediaNota / 10) * 100;

        return {
          alunoId,
          nome: aluno.nome,
          turma: getTurmaName(aluno.turmaId),
          nota: mediaNota,
          percentual
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.nota - a.nota)
      .slice(0, 8)
      .map((item, idx) => ({
        posicao: idx + 1,
        ...item
      }));

    return ranking;
  }, [allRespostasComNotas, alunos, getTurmaName]);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Relatórios e Análises</h1>
            <p className="text-muted-foreground text-lg">
              Visualize o desempenho geral e exporte dados detalhados
            </p>
          </div>

          {/* Botões de Exportação */}
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <FileText className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <FileDown className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-2 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Filtros de Análise
            </CardTitle>
            <CardDescription>
              Filtre os dados por período, turma ou disciplina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Período
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="1bim">1º Bimestre</SelectItem>
                    <SelectItem value="2bim">2º Bimestre</SelectItem>
                    <SelectItem value="3bim">3º Bimestre</SelectItem>
                    <SelectItem value="4bim">4º Bimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Turma
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Disciplina
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                    <SelectItem value="mat">Matemática</SelectItem>
                    <SelectItem value="port">Português</SelectItem>
                    <SelectItem value="hist">História</SelectItem>
                    <SelectItem value="geo">Geografia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Média Geral</p>
                <p className="text-4xl font-bold text-primary">{totals.mediaGeral.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Escala de 0 a 10</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shadow-md">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Taxa de Aprovação</p>
                <p className="text-4xl font-bold text-success">{taxaAprovacao.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Notas ≥ 6.0</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-success/10 dark:bg-success/20 flex items-center justify-center shadow-md">
                <Target className="w-7 h-7 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Provas Aplicadas</p>
                <p className="text-4xl font-bold text-info">{totals.totalProvas}</p>
                <p className="text-xs text-muted-foreground">Total cadastrado</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-info/10 dark:bg-info/20 flex items-center justify-center shadow-md">
                <FileText className="w-7 h-7 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Alunos Avaliados</p>
                <p className="text-4xl font-bold text-warning">{alunosAvaliados}</p>
                <p className="text-xs text-muted-foreground">Com notas registradas</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-warning/10 dark:bg-warning/20 flex items-center justify-center shadow-md">
                <Users className="w-7 h-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Primeira Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Média por Turma */}
        <Card className="border-2 shadow-md bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Média por Turma
            </CardTitle>
            <CardDescription>
              Desempenho médio de cada turma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mediaPorTurma.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 dark:text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground font-medium">Nenhum dado disponível</p>
                <p className="text-sm text-muted-foreground/70 dark:text-muted-foreground/60 mt-1">Cadastre provas e turmas para ver os dados</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={mediaPorTurma}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" />
                  <XAxis
                    dataKey="turma"
                    className="text-muted-foreground text-sm"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    className="text-muted-foreground text-sm"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent className="rounded-lg border shadow-lg bg-card" />}
                  />
                  <Bar
                    dataKey="media"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-success" />
              Distribuição de Notas
            </CardTitle>
            <CardDescription>
              Quantidade de alunos por faixa de nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            {distribuicaoNotas.every(d => d.quantidade === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground/30 dark:text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground font-medium">Nenhum dado disponível</p>
                <p className="text-sm text-muted-foreground/70 dark:text-muted-foreground/60 mt-1">Cadastre provas e turmas para ver os dados</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <PieChart>
                  <Pie
                    data={distribuicaoNotas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ faixa, quantidade, percent }) =>
                      `${faixa}: ${quantidade} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="quantidade"
                    className="cursor-pointer"
                  >
                    {distribuicaoNotas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent className="rounded-lg border shadow-lg bg-card" />}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px', color: 'hsl(var(--muted-foreground))' }}
                    iconType="circle"
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico - Acerto por Questão */}
      <Card className="border-2 shadow-md bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="w-5 h-5 text-info" />
            Percentual de Acerto por Questão
          </CardTitle>
          <CardDescription>
            Análise de dificuldade de cada questão
          </CardDescription>
        </CardHeader>
        <CardContent>
          {acertoPorQuestao.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="w-12 h-12 text-muted-foreground/30 dark:text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">Nenhum dado disponível</p>
              <p className="text-sm text-muted-foreground/70 dark:text-muted-foreground/60 mt-1">Cadastre gabaritos e respostas para ver os dados</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acertoPorQuestao}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" />
                  <XAxis
                    dataKey="questao"
                    className="text-muted-foreground text-sm"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    className="text-muted-foreground text-sm"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent className="rounded-lg border shadow-lg bg-card" />}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Acerto']}
                  />
                  <Bar
                    dataKey="percentual"
                    fill="hsl(var(--success))"
                    radius={[8, 8, 0, 0]}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Ranking de Alunos */}
      <Card className="border-2 shadow-md bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Ranking dos Melhores Alunos
          </CardTitle>
          <CardDescription>
            Top 8 alunos com melhor desempenho geral
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rankingAlunos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground/30 dark:text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">Nenhum dado disponível</p>
              <p className="text-sm text-muted-foreground/70 dark:text-muted-foreground/60 mt-1">Cadastre provas e respostas para ver o ranking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rankingAlunos.map((aluno) => (
                <div
                  key={aluno.alunoId}
                  className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                    aluno.posicao === 1
                      ? "bg-warning/10 dark:bg-warning/20 border-warning/30 dark:border-warning/40 shadow-md"
                      : aluno.posicao === 2
                      ? "bg-muted/50 dark:bg-muted/30 border-muted-foreground/20 dark:border-muted-foreground/30"
                      : aluno.posicao === 3
                      ? "bg-warning/5 dark:bg-warning/10 border-warning/20 dark:border-warning/30"
                      : "border-border hover:bg-accent/50 dark:hover:bg-accent/30 hover:border-accent-foreground/20"
                  }`}
                >
                  {/* Posição */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                      aluno.posicao === 1
                        ? "bg-warning dark:bg-warning/90 text-warning-foreground ring-2 ring-warning/50 dark:ring-warning/40"
                        : aluno.posicao === 2
                        ? "bg-muted-foreground/20 dark:bg-muted-foreground/30 text-foreground"
                        : aluno.posicao === 3
                        ? "bg-warning/30 dark:bg-warning/40 text-warning-foreground"
                        : "bg-muted dark:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {aluno.posicao === 1 && <Trophy className="w-6 h-6" />}
                    {aluno.posicao !== 1 && <span>{aluno.posicao}º</span>}
                  </div>

                  {/* Info do Aluno */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg truncate">{aluno.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {aluno.turma}
                      </Badge>
                    </div>
                  </div>

                  {/* Nota e Percentual */}
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-3xl font-bold text-primary">{aluno.nota.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Nota média</p>
                    </div>
                    <Badge
                      variant={aluno.nota >= 6 ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {aluno.percentual.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rodapé de Exportação */}
      <Card className="bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 dark:border-primary/30 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                <FileText className="w-5 h-5 text-primary" />
                Exportar dados completos
              </h3>
              <p className="text-muted-foreground max-w-md">
                Gere relatórios detalhados em PDF ou planilhas CSV com todos os dados de desempenho
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button size="lg" className="gap-2 shadow-md">
                <FileText className="w-4 h-4" />
                Gerar PDF Completo
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-2">
                <FileDown className="w-4 h-4" />
                Baixar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
