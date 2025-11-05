import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { 
  Users, 
  UserCog, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  Menu, 
  LogOut,
  LayoutDashboard,
  FileCheck
} from "lucide-react";
import { Separator } from "./ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  pageTitle?: string;
}

interface NavItem {
  label: string;
  icon: typeof Users;
  page: string;
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  { label: "Turmas", icon: Users, page: "turmas" },
  { label: "Alunos", icon: GraduationCap, page: "alunos" },
  { label: "Professores", icon: UserCog, page: "professores" },
  { label: "Provas", icon: FileText, page: "provas" },
  { label: "Correção", icon: FileCheck, page: "correcao" },
  { label: "Relatórios", icon: BarChart3, page: "relatorios" },
];

function SidebarContent({
  currentPage,
  onNavigate,
  onMobileClose,
}: {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onMobileClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3>Sistema de Provas</h3>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => {
                onNavigate?.(item.page);
                onMobileClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <p className="text-muted-foreground px-4">
          © 2025 SCP
        </p>
      </div>
    </div>
  );
}

export function DashboardLayout({ 
  children, 
  currentPage = "dashboard",
  onNavigate,
  pageTitle = "Dashboard"
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <SidebarContent currentPage={currentPage} onNavigate={onNavigate} />
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent 
                  currentPage={currentPage} 
                  onNavigate={onNavigate}
                  onMobileClose={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Page Title - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block">
              <h2>{pageTitle}</h2>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3>SCP</h3>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p>Prof. João Silva</p>
                <p className="text-muted-foreground">Coordenador</p>
              </div>
              <Button variant="outline" size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
