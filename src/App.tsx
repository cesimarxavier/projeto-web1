import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeProvider } from "@/components/theme-provider";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import("@/components/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const TurmasPage = lazy(() => import("@/components/pages/TurmasPage").then(m => ({ default: m.TurmasPage })));
const AlunosPage = lazy(() => import("@/components/pages/AlunosPage").then(m => ({ default: m.AlunosPage })));
const ProfessoresPage = lazy(() => import("@/components/pages/ProfessoresPage").then(m => ({ default: m.ProfessoresPage })));
const ProvasPage = lazy(() => import("@/components/pages/ProvasPage").then(m => ({ default: m.ProvasPage })));
const RespostasCorrecaoPage = lazy(() => import("@/components/pages/RespostasCorrecaoPage").then(m => ({ default: m.RespostasCorrecaoPage })));
const RelatoriosPage = lazy(() => import("@/components/pages/RelatoriosPage").then(m => ({ default: m.RelatoriosPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DashboardLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/turmas" element={<TurmasPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
            <Route path="/professores" element={<ProfessoresPage />} />
            <Route path="/provas" element={<ProvasPage />} />
            <Route path="/correcao" element={<RespostasCorrecaoPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </ThemeProvider>
  );
}
