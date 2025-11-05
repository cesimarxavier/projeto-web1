import { useState } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./components/pages/DashboardPage";
import { TurmasPage } from "./components/pages/TurmasPage";
import { AlunosPage } from "./components/pages/AlunosPage";
import { ProfessoresPage } from "./components/pages/ProfessoresPage";
import { ProvasPage } from "./components/pages/ProvasPage";
import { RespostasCorrecaoPage } from "./components/pages/RespostasCorrecaoPage";
import { RelatoriosPage } from "./components/pages/RelatoriosPage";

type Page = "dashboard" | "turmas" | "alunos" | "professores" | "provas" | "correcao" | "relatorios";

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  turmas: "Turmas",
  alunos: "Alunos",
  professores: "Professores",
  provas: "Provas",
  correcao: "Correção",
  relatorios: "Relatórios",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "turmas":
        return <TurmasPage />;
      case "alunos":
        return <AlunosPage />;
      case "professores":
        return <ProfessoresPage />;
      case "provas":
        return <ProvasPage />;
      case "correcao":
        return <RespostasCorrecaoPage />;
      case "relatorios":
        return <RelatoriosPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page as Page)}
      pageTitle={pageTitles[currentPage]}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
