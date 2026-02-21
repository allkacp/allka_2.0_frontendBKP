import React, { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingCreateProject } from "@/components/floating-create-project"
import { MobileLayoutWrapper } from "@/components/mobile-layout-wrapper"

import { AccountTypeProvider } from "@/contexts/account-type-context"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { CompanyProvider } from "@/contexts/company-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { CartProvider } from "@/contexts/cart-context"
import { PricingProvider } from "@/lib/contexts/pricing-context"
import { SpecialtyProvider } from "@/lib/contexts/specialty-context"
import { ProductProvider } from "@/lib/contexts/product-context"

// Lazy-loaded pages
const HomePage = React.lazy(() => import("@/app/page"))
const AccountPage = React.lazy(() => import("@/app/account/page"))

const AdminDashboardPage = React.lazy(() => import("@/app/admin/dashboard/page"))
const AdminDashboardConfigPage = React.lazy(() => import("@/app/admin/dashboard-config/page"))
const AdminUsuariosPage = React.lazy(() => import("@/app/admin/usuarios/page"))
const AdminUsuariosInternosPage = React.lazy(() => import("@/app/admin/usuarios-internos/page"))
const AdminUsersPage = React.lazy(() => import("@/app/admin/users/page"))
const AdminEmpresasPage = React.lazy(() => import("@/app/admin/empresas/page"))
const AdminNomadesPg = React.lazy(() => import("@/app/admin/nomades/page"))
const AdminAgenciasPage = React.lazy(() => import("@/app/admin/agencias/page"))
const AdminProjetosPage = React.lazy(() => import("@/app/admin/projetos/page"))
const AdminTarefasPage = React.lazy(() => import("@/app/admin/produtos/page"))
const AdminProdutosPage = React.lazy(() => import("@/app/admin/produtos/page"))
const AdminPrecificacaoPage = React.lazy(() => import("@/app/admin/precificacao/page"))
const AdminNiveisPage = React.lazy(() => import("@/app/admin/niveis/page"))
const AdminNiveisNomades = React.lazy(() => import("@/app/admin/niveis-nomades/page"))
const AdminLevelsPage = React.lazy(() => import("@/app/admin/levels/page"))
const AdminEspecialidadesPage = React.lazy(() => import("@/app/admin/especialidades/page"))
const AdminAllkademyPage = React.lazy(() => import("@/app/admin/allkademy/page"))
const AdminFinanceiroPage = React.lazy(() => import("@/app/admin/financeiro/page"))
const AdminRelatoriosPage = React.lazy(() => import("@/app/admin/relatorios/page"))
const AdminDisponibilidadePage = React.lazy(() => import("@/app/admin/disponibilidade/page"))
const AdminComissionamentosPage = React.lazy(() => import("@/app/admin/comissionamentos/page"))
const AdminCommissionsPage = React.lazy(() => import("@/app/admin/commissions/page"))
const AdminPromocoesPage = React.lazy(() => import("@/app/admin/promocoes/page"))
const AdminCampanhasIndicacao = React.lazy(() => import("@/app/admin/campanhas-indicacao/page"))
const AdminOnboardingPage = React.lazy(() => import("@/app/admin/onboarding/page"))
const AdminPermissoesPage = React.lazy(() => import("@/app/admin/permissoes/page"))
const AdminPermissionsPage = React.lazy(() => import("@/app/admin/permissions/page"))
const AdminTermsPage = React.lazy(() => import("@/app/admin/terms/page"))
const AdminNotificationsPage = React.lazy(() => import("@/app/admin/notifications/page"))
const AdminClientesPage = React.lazy(() => import("@/app/admin/clientes/page"))
const AdminConfiguracoesPage = React.lazy(() => import("@/app/admin/configuracoes/page"))
const AdminConfiguracionPage = React.lazy(() => import("@/app/admin/configuracion/page"))
const AdminSistemaPage = React.lazy(() => import("@/app/admin/sistema/page"))

const AgenciasPage = React.lazy(() => import("@/app/agencias/page"))
const AgenciasDashboardPage = React.lazy(() => import("@/app/agencias/dashboard/page"))
const AgenciasProjetosPage = React.lazy(() => import("@/app/agencias/projetos/page"))
const AgenciasClientesPage = React.lazy(() => import("@/app/agencias/clientes/page"))
const AgenciasEquipePage = React.lazy(() => import("@/app/agencias/equipe/page"))
const AgenciasFinanceiroPage = React.lazy(() => import("@/app/agencias/financeiro/page"))
const AgenciasLideradasPage = React.lazy(() => import("@/app/agencias/lideradas/page"))
const AgenciasPerfilPage = React.lazy(() => import("@/app/agencias/perfil/page"))
const AgenciasProgramaPage = React.lazy(() => import("@/app/agencias/programa/page"))
const AgenciasConfiguracoesPage = React.lazy(() => import("@/app/agencias/configuracoes/page"))

const AgencyPage = React.lazy(() => import("@/app/agency/page"))
const AgencyDashboardPage = React.lazy(() => import("@/app/agency/dashboard/page"))
const AgencyProjetosPage = React.lazy(() => import("@/app/agency/projetos/page"))
const AgencyClientesPage = React.lazy(() => import("@/app/agency/clientes/page"))
const AgencyEquipePage = React.lazy(() => import("@/app/agency/equipe/page"))
const AgencyPerfilPage = React.lazy(() => import("@/app/agency/perfil/page"))
const AgencyProgramaPage = React.lazy(() => import("@/app/agency/programa/page"))

const AllkademyPage = React.lazy(() => import("@/app/allkademy/page"))
const AvailabilityPage = React.lazy(() => import("@/app/availability/page"))

const CatalogPage = React.lazy(() => import("@/app/catalog/page"))
const CatalogDetailPage = React.lazy(() => import("@/app/catalog/[id]/page"))

const ClientsPage = React.lazy(() => import("@/app/clients/page"))

const CompanyPage = React.lazy(() => import("@/app/company/page"))
const CompanyDashboardPage = React.lazy(() => import("@/app/company/dashboard/page"))
const CompanyProjetosPage = React.lazy(() => import("@/app/company/projetos/page"))
const CompanyAprovacoesPage = React.lazy(() => import("@/app/company/aprovacoes/page"))
const CompanyAprovacoesDetailPage = React.lazy(() => import("@/app/company/aprovacoes/[id]/page"))
const CompanyPagamentosPage = React.lazy(() => import("@/app/company/pagamentos/page"))
const CompanyRelatoriosPage = React.lazy(() => import("@/app/company/relatorios/page"))

const FinancialOverduePage = React.lazy(() => import("@/app/financial/overdue/page"))
const FinancialWalletsPage = React.lazy(() => import("@/app/financial/wallets/page"))
const FinancialWithdrawalsPage = React.lazy(() => import("@/app/financial/withdrawals/page"))

const InHousePage = React.lazy(() => import("@/app/in-house/page"))
const InHouseDashboardPage = React.lazy(() => import("@/app/in-house/dashboard/page"))
const InHouseProjetosPage = React.lazy(() => import("@/app/in-house/projetos/page"))
const InHouseEquipePage = React.lazy(() => import("@/app/in-house/equipe/page"))
const InHouseFinanceiroPage = React.lazy(() => import("@/app/in-house/financeiro/page"))
const InHouseCatalogoPage = React.lazy(() => import("@/app/in-house/catalogo/page"))
const InHouseRelatoriosPage = React.lazy(() => import("@/app/in-house/relatorios/page"))
const InHouseConfiguracoesPage = React.lazy(() => import("@/app/in-house/configuracoes/page"))

const LandingPage = React.lazy(() => import("@/app/landing/page"))
const MatchQueuePage = React.lazy(() => import("@/app/match-queue/page"))

const NomadesDashboardPage = React.lazy(() => import("@/app/nomades/dashboard/page"))
const NomadesPage = React.lazy(() => import("@/app/nomades/page"))
const NomadesProjetosPage = React.lazy(() => import("@/app/nomades/projetos/page"))
const NomadesTarefasPage = React.lazy(() => import("@/app/nomades/tarefas/page"))
const NomadesMinhasTarefasPage = React.lazy(() => import("@/app/nomades/minhastarefas/page"))
const NomadesMinhasTarefasDetailPage = React.lazy(() => import("@/app/nomades/minhastarefas/[id]/page"))
const NomadesTarefasDisponiveisPage = React.lazy(() => import("@/app/nomades/tarefasdisponiveis/page"))
const NomadesDisponibilidadePage = React.lazy(() => import("@/app/nomades/disponibilidade/page"))
const NomadesFinanceiroPage = React.lazy(() => import("@/app/nomades/financeiro/page"))
const NomadesGanhosPage = React.lazy(() => import("@/app/nomades/ganhos/page"))
const NomadesHistoricoPage = React.lazy(() => import("@/app/nomades/historico/page"))
const NomadesPerfilPage = React.lazy(() => import("@/app/nomades/perfil/page"))
const NomadesProgramaPage = React.lazy(() => import("@/app/nomades/programa/page"))
const NomadesHabilitacoesPage = React.lazy(() => import("@/app/nomades/habilitacoes/page"))

const PartnerPage = React.lazy(() => import("@/app/partner/page"))
const PremiumProjectsPage = React.lazy(() => import("@/app/premium-projects/page"))
const PremiumProjectsChurnPage = React.lazy(() => import("@/app/premium-projects/churn/page"))
const PricingPage = React.lazy(() => import("@/app/pricing/page"))

const ProjectsPage = React.lazy(() => import("@/app/projects/page"))
const ProjectsDetailPage = React.lazy(() => import("@/app/projects/[id]/page"))

const QualificationsPage = React.lazy(() => import("@/app/qualifications/page"))
const QualificationsNomadePage = React.lazy(() => import("@/app/qualifications/nomade/page"))

const ReportsPage = React.lazy(() => import("@/app/reports/page"))
const TasksPage = React.lazy(() => import("@/app/tasks/page"))
const TaskTemplatesPage = React.lazy(() => import("@/app/task-templates/page"))
const TeamPage = React.lazy(() => import("@/app/team/page"))

const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
)

class PageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Page error:", error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace" }}>
          <h2 style={{ color: "red" }}>Erro ao carregar página</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fee", padding: 16, borderRadius: 8 }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#888", marginTop: 8 }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}>
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AccountTypeProvider>
        <SidebarProvider>
          <CompanyProvider>
            <PricingProvider>
              <SpecialtyProvider>
                <ProductProvider>
                  <CartProvider>
                    <MobileLayoutWrapper>
                  <div className="flex h-screen bg-gray-50 overflow-visible font-sans">
                    <div
                      className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden"
                      id="sidebar-overlay"
                    />
                    <div className="hidden lg:flex">
                      <Sidebar />
                    </div>
                    <div
                      className="lg:hidden fixed inset-y-0 left-0 z-50 transform -translate-x-full transition-transform duration-300 ease-in-out"
                      id="mobile-sidebar"
                    >
                      <Sidebar />
                    </div>
                    <div className="flex-1 flex flex-col overflow-visible min-w-0">
                      <Header />
                      <main className="flex-1 overflow-auto bg-slate-200 mx-0 py-12 px-14 pb-mobile-nav">
                        <PageErrorBoundary>
                          <Suspense fallback={<PageLoader />}>
                            {children}
                          </Suspense>
                        </PageErrorBoundary>
                      </main>
                      <Footer />
                    </div>
                  </div>
                  <FloatingCreateProject />
                    </MobileLayoutWrapper>
                  </CartProvider>
                </ProductProvider>
              </SpecialtyProvider>
            </PricingProvider>
          </CompanyProvider>
        </SidebarProvider>
      </AccountTypeProvider>
    </SettingsProvider>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Landing - sem layout */}
      <Route
        path="/landing"
        element={
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        }
      />

      {/* Rotas com layout principal */}
      <Route
        path="/*"
        element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={<AccountPage />} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard-config" element={<AdminDashboardConfigPage />} />
              <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
              <Route path="/admin/usuarios-internos" element={<AdminUsuariosInternosPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/empresas" element={<AdminEmpresasPage />} />
              <Route path="/admin/nomades" element={<AdminNomadesPg />} />
              <Route path="/admin/agencias" element={<AdminAgenciasPage />} />
              <Route path="/admin/projetos" element={<AdminProjetosPage />} />
              <Route path="/admin/produtos" element={<AdminProdutosPage />} />
              <Route path="/admin/precificacao" element={<AdminPrecificacaoPage />} />
              <Route path="/admin/niveis" element={<AdminNiveisPage />} />
              <Route path="/admin/niveis-nomades" element={<AdminNiveisNomades />} />
              <Route path="/admin/levels" element={<AdminLevelsPage />} />
              <Route path="/admin/especialidades" element={<AdminEspecialidadesPage />} />
              <Route path="/admin/allkademy" element={<AdminAllkademyPage />} />
              <Route path="/admin/financeiro" element={<AdminFinanceiroPage />} />
              <Route path="/admin/relatorios" element={<AdminRelatoriosPage />} />
              <Route path="/admin/disponibilidade" element={<AdminDisponibilidadePage />} />
              <Route path="/admin/comissionamentos" element={<AdminComissionamentosPage />} />
              <Route path="/admin/commissions" element={<AdminCommissionsPage />} />
              <Route path="/admin/promocoes" element={<AdminPromocoesPage />} />
              <Route path="/admin/campanhas-indicacao" element={<AdminCampanhasIndicacao />} />
              <Route path="/admin/onboarding" element={<AdminOnboardingPage />} />
              <Route path="/admin/permissoes" element={<AdminPermissoesPage />} />
              <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
              <Route path="/admin/terms" element={<AdminTermsPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/clientes" element={<AdminClientesPage />} />
              <Route path="/admin/configuracoes" element={<AdminConfiguracoesPage />} />
              <Route path="/admin/configuracion" element={<AdminConfiguracionPage />} />
              <Route path="/admin/sistema" element={<AdminSistemaPage />} />

              {/* Agências */}
              <Route path="/agencias" element={<AgenciasPage />} />
              <Route path="/agencias/dashboard" element={<AgenciasDashboardPage />} />
              <Route path="/agencias/projetos" element={<AgenciasProjetosPage />} />
              <Route path="/agencias/clientes" element={<AgenciasClientesPage />} />
              <Route path="/agencias/equipe" element={<AgenciasEquipePage />} />
              <Route path="/agencias/financeiro" element={<AgenciasFinanceiroPage />} />
              <Route path="/agencias/lideradas" element={<AgenciasLideradasPage />} />
              <Route path="/agencias/perfil" element={<AgenciasPerfilPage />} />
              <Route path="/agencias/programa" element={<AgenciasProgramaPage />} />
              <Route path="/agencias/configuracoes" element={<AgenciasConfiguracoesPage />} />

              {/* Agency */}
              <Route path="/agency" element={<Navigate to="/agency/dashboard" replace />} />
              <Route path="/agency/dashboard" element={<AgencyDashboardPage />} />
              <Route path="/agency/projetos" element={<AgencyProjetosPage />} />
              <Route path="/agency/clientes" element={<AgencyClientesPage />} />
              <Route path="/agency/equipe" element={<AgencyEquipePage />} />
              <Route path="/agency/perfil" element={<AgencyPerfilPage />} />
              <Route path="/agency/programa" element={<AgencyProgramaPage />} />

              {/* Allkademy */}
              <Route path="/allkademy" element={<AllkademyPage />} />

              {/* Availability */}
              <Route path="/availability" element={<AvailabilityPage />} />

              {/* Catalog */}
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:id" element={<CatalogDetailPage />} />

              {/* Clients */}
              <Route path="/clients" element={<ClientsPage />} />

              {/* Company */}
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
              <Route path="/company/projetos" element={<CompanyProjetosPage />} />
              <Route path="/company/aprovacoes" element={<CompanyAprovacoesPage />} />
              <Route path="/company/aprovacoes/:id" element={<CompanyAprovacoesDetailPage />} />
              <Route path="/company/pagamentos" element={<CompanyPagamentosPage />} />
              <Route path="/company/relatorios" element={<CompanyRelatoriosPage />} />

              {/* Financial */}
              <Route path="/financial/overdue" element={<FinancialOverduePage />} />
              <Route path="/financial/wallets" element={<FinancialWalletsPage />} />
              <Route path="/financial/withdrawals" element={<FinancialWithdrawalsPage />} />

              {/* In-House */}
              <Route path="/in-house" element={<InHousePage />} />
              <Route path="/in-house/dashboard" element={<InHouseDashboardPage />} />
              <Route path="/in-house/projetos" element={<InHouseProjetosPage />} />
              <Route path="/in-house/equipe" element={<InHouseEquipePage />} />
              <Route path="/in-house/financeiro" element={<InHouseFinanceiroPage />} />
              <Route path="/in-house/catalogo" element={<InHouseCatalogoPage />} />
              <Route path="/in-house/relatorios" element={<InHouseRelatoriosPage />} />
              <Route path="/in-house/configuracoes" element={<InHouseConfiguracoesPage />} />

              {/* Match Queue */}
              <Route path="/match-queue" element={<MatchQueuePage />} />

              {/* Nomades */}
              <Route path="/nomades" element={<NomadesPage />} />
              <Route path="/nomades/dashboard" element={<NomadesDashboardPage />} />
              <Route path="/nomades/projetos" element={<NomadesProjetosPage />} />
              <Route path="/nomades/tarefas" element={<NomadesTarefasPage />} />
              <Route path="/nomades/minhastarefas" element={<NomadesMinhasTarefasPage />} />
              <Route path="/nomades/minhastarefas/:id" element={<NomadesMinhasTarefasDetailPage />} />
              <Route path="/nomades/tarefasdisponiveis" element={<NomadesTarefasDisponiveisPage />} />
              <Route path="/nomades/disponibilidade" element={<NomadesDisponibilidadePage />} />
              <Route path="/nomades/financeiro" element={<NomadesFinanceiroPage />} />
              <Route path="/nomades/ganhos" element={<NomadesGanhosPage />} />
              <Route path="/nomades/historico" element={<NomadesHistoricoPage />} />
              <Route path="/nomades/perfil" element={<NomadesPerfilPage />} />
              <Route path="/nomades/programa" element={<NomadesProgramaPage />} />
              <Route path="/nomades/habilitacoes" element={<NomadesHabilitacoesPage />} />

              {/* Partner */}
              <Route path="/partner" element={<PartnerPage />} />

              {/* Premium Projects */}
              <Route path="/premium-projects" element={<PremiumProjectsPage />} />
              <Route path="/premium-projects/churn" element={<PremiumProjectsChurnPage />} />

              {/* Pricing */}
              <Route path="/pricing" element={<PricingPage />} />

              {/* Projects */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectsDetailPage />} />

              {/* Qualifications */}
              <Route path="/qualifications" element={<QualificationsPage />} />
              <Route path="/qualifications/nomade" element={<QualificationsNomadePage />} />

              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />

              {/* Tasks */}
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/task-templates" element={<TaskTemplatesPage />} />

              {/* Team */}
              <Route path="/team" element={<TeamPage />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  )
}
