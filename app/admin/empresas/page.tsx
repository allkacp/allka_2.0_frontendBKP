
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, TrendingUp, Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Filter, X, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ItemsPerPageSelect } from "@/components/items-per-page-select"
import { CompanyCreateSlidePanel } from "@/components/company-create-slide-panel"
import { CompanyEditSlidePanel } from "@/components/company-edit-slide-panel"
import { CompanyViewSlidePanel } from "@/components/company-view-slide-panel"
import PageHeader from "@/components/page-header"

type CompanyType = "all" | "company" | "agency" | "nomad"
type CompanyStatus = "all" | "active" | "inactive" | "pending"

type Company = {
  id: number
  name: string
  type: CompanyType
  email: string
  phone: string
  document: string
  location: string
  account_type?: string
  partner_level?: string
  status: CompanyStatus
  users_count: number
  users_online: number
  projects_count: number
  created_at: string
  mau: number
  dau: number
  bitrix_id?: string
  asaas_id?: string
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: "Acme Corporation",
    type: "company",
    email: "contact@acme.com",
    phone: "+1 234 567 8900",
    document: "12.345.678/0001-90",
    location: "São Paulo, SP",
    account_type: "Premium",
    partner_level: "Gold",
    status: "active",
    users_count: 45,
    users_online: 12,
    projects_count: 23,
    created_at: "2023-01-15",
    mau: 890,
    dau: 245,
    bitrix_id: "BT123456",
    asaas_id: "AS789012",
  },
  {
    id: 2,
    name: "Tech Solutions",
    type: "agency",
    email: "info@techsolutions.com",
    phone: "+1 234 567 8901",
    document: "98.765.432/0001-10",
    location: "Rio de Janeiro, RJ",
    account_type: "Standard",
    status: "active",
    users_count: 28,
    users_online: 8,
    projects_count: 15,
    created_at: "2023-02-20",
    mau: 560,
    dau: 180,
  },
]

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies)
  const [searchQuery, setSearchQuery] = useState("")
  const [createPanelOpen, setCreatePanelOpen] = useState(false)
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const [viewPanelOpen, setViewPanelOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  
  // Filtros avançados
  const [advancedFilters, setAdvancedFilters] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    whatsapp: "",
    types: [] as string[],
    statuses: [] as string[],
    registrationDateFrom: "",
    registrationDateTo: "",
    lastAccessDateFrom: "",
    lastAccessDateTo: "",
  })

  // Gerenciamento de filtros salvos
  const [savedFilters, setSavedFilters] = useState<Array<{id: string, name: string, filters: any}>>([])
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null)
  const [isEditingFilter, setIsEditingFilter] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [saveAsFilter, setSaveAsFilter] = useState(false)
  const [isDuplicatingFilter, setIsDuplicatingFilter] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  useEffect(() => {
    let filtered = companies

    if (searchQuery) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.document.includes(searchQuery),
      )
    }

    // Aplicar filtros avançados
    if (advancedFilters.name) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(advancedFilters.name.toLowerCase())
      )
    }

    if (advancedFilters.cnpj) {
      filtered = filtered.filter((company) =>
        company.document.includes(advancedFilters.cnpj)
      )
    }

    if (advancedFilters.email) {
      filtered = filtered.filter((company) =>
        company.email.toLowerCase().includes(advancedFilters.email.toLowerCase())
      )
    }

    if (advancedFilters.phone) {
      filtered = filtered.filter((company) =>
        company.phone.includes(advancedFilters.phone)
      )
    }

    if (advancedFilters.types.length > 0) {
      filtered = filtered.filter((company) =>
        advancedFilters.types.includes(company.type)
      )
    }

    if (advancedFilters.statuses.length > 0) {
      filtered = filtered.filter((company) =>
        advancedFilters.statuses.includes(company.status)
      )
    }

    if (advancedFilters.registrationDateFrom) {
      filtered = filtered.filter((company) =>
        new Date(company.created_at) >= new Date(advancedFilters.registrationDateFrom)
      )
    }

    if (advancedFilters.registrationDateTo) {
      filtered = filtered.filter((company) =>
        new Date(company.created_at) <= new Date(advancedFilters.registrationDateTo)
      )
    }

    setFilteredCompanies(filtered)
    setCurrentPage(1)
  }, [searchQuery, companies, advancedFilters])

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const totalPages = Math.ceil(filteredCompanies.length / pageSize)

  // Função para renderizar números de página
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    const halfVisible = Math.floor(maxVisible / 2)

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= halfVisible + 1) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i)
        }
        if (totalPages > maxVisible) pages.push("...")
      } else if (currentPage >= totalPages - halfVisible) {
        pages.push("...")
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push("...")
        for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
          pages.push(i)
        }
        pages.push("...")
      }
    }
    return pages
  }

  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    totalUsers: companies.reduce((acc, c) => acc + c.users_count, 0),
    totalProjects: companies.reduce((acc, c) => acc + c.projects_count, 0),
  }

  const handleCreateCompany = (data: any) => {
    console.log("Creating company:", data)
    setCreatePanelOpen(false)
  }

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company)
    setEditPanelOpen(true)
  }

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setViewPanelOpen(true)
  }

  const handleSaveCompany = (data: any) => {
    console.log("Saving company:", data)
    setEditPanelOpen(false)
    setSelectedCompany(null)
  }

  const handleDeleteCompany = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      setCompanies(companies.filter((c) => c.id !== id))
    }
  }

  const getTypeLabel = (type: CompanyType) => {
    const labels = {
      all: "Todos",
      company: "Empresa",
      agency: "Agência",
      nomad: "Nômade",
    }
    return labels[type]
  }

  const getStatusColor = (status: CompanyStatus) => {
    const colors = {
      all: "default",
      active: "default",
      inactive: "secondary",
      pending: "outline",
    }
    return colors[status] as any
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <PageHeader
          title={
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Empresas
            </span>
          }
          description="Gerencie todas as empresas cadastradas na plataforma"
        />
        <Button
          onClick={() => setCreatePanelOpen(true)}
          className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Empresa
        </Button>
      </div>

      <Accordion type="single" collapsible className="mb-1">
        <AccordionItem value="stats" className="border-none">
          <AccordionTrigger className="bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 transition-colors">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Estatísticas e Métricas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">Total de Empresas</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </Card>

              <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-900">Empresas Ativas</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{stats.active}</p>
              </Card>

              <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-900">Total de Usuários</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{stats.totalUsers}</p>
              </Card>

              <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-900">Total de Projetos</span>
                </div>
                <p className="text-2xl font-bold text-orange-700">{stats.totalProjects}</p>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-4 pb-4 px-4">
          <div className="space-y-4">
            {/* Compact Controls Bar - Modern Pagination Layout */}
      <div className="flex items-center justify-between gap-3 h-10">
        {/* Left: Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Center-Left: Items per page */}
        <ItemsPerPageSelect 
          value={pageSize.toString()} 
          onValueChange={(value) => {
            setPageSize(Number(value))
            setCurrentPage(1)
          }}
          variant="top"
        />

        {/* Center: Filter Button */}
        <Button
          onClick={() => setIsFilterModalOpen(true)}
          variant="outline"
          size="sm"
          className="h-9 gap-2 px-3 text-xs text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>

        {/* Right: Modern Pagination */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-9 w-8 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="flex items-center gap-0.5">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="text-xs text-slate-600 dark:text-slate-400 px-1.5">...</span>
                ) : (
                  <Button
                    onClick={() => setCurrentPage(Number(page))}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-8 p-0 text-xs font-semibold ${
                      page === currentPage
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:border-blue-600"
                        : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-8 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20">
            <tr>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Empresa</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Contato</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Dados</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Status</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Tipo</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-slate-700 dark:text-slate-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompanies.map((company) => (
              <tr
                key={company.id}
                className="border-b border-slate-200/40 dark:border-slate-700/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                {/* Company Name */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{company.location}</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-4 py-2">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-900 dark:text-slate-100">{company.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{company.phone}</p>
                  </div>
                </td>

                {/* Document/CNPJ */}
                <td className="px-4 py-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">CNPJ:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">{company.document}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Users className="inline h-3 w-3 mr-1" />
                      {company.users_count} usuários
                    </p>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-2">
                  <Badge
                    className={
                      company.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs px-2 py-0.5"
                        : company.status === "inactive"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-0.5"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-0.5"
                    }
                  >
                    {company.status === "active" ? "Ativo" : company.status === "inactive" ? "Inativo" : "Pendente"}
                  </Badge>
                </td>

                {/* Type Badge */}
                <td className="px-4 py-2">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {getTypeLabel(company.type)}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCompany(company)}
                            className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Ver Detalhes</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCompany(company.id)}
                            className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Excluir</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedCompanies.length === 0 && (
        <div className="text-center py-6 text-slate-500">
          <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-xs">Nenhuma empresa encontrada</p>
        </div>
      )}

      {/* Pagination Bottom - Modern Numeric */}
      {filteredCompanies.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-3 pb-2">
          <ItemsPerPageSelect 
            value={pageSize.toString()} 
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
            variant="bottom"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="text-xs text-slate-600 dark:text-slate-400 px-2">...</span>
                  ) : (
                    <Button
                      onClick={() => setCurrentPage(Number(page))}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className={`h-7 w-7 p-0 text-xs font-medium ${
                        page === currentPage
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:border-blue-600"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Modal - Two Columns Layout (Saved Filters + Configuration) */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              if (unsavedChanges) {
                if (!window.confirm("Você tem alterações não salvas. Deseja sair?")) {
                  return
                }
              }
              setIsFilterModalOpen(false)
              setSelectedFilterId(null)
              setIsEditingFilter(false)
              setUnsavedChanges(false)
            }}
          />

          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[85vh] border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
            {/* Header with gradient */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold">Filtros Avançados de Empresas</h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  {selectedFilterId && !isEditingFilter ? "Filtro carregado" : isEditingFilter ? "Editando filtro" : "Configure filtros detalhados"}
                  {unsavedChanges && " • Alterações não salvas"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (unsavedChanges) {
                    if (!window.confirm("Você tem alterações não salvas. Deseja sair?")) {
                      return
                    }
                  }
                  setIsFilterModalOpen(false)
                  setSelectedFilterId(null)
                  setIsEditingFilter(false)
                  setUnsavedChanges(false)
                }}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content - Two columns with flex layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column - Saved Filters (30%) */}
              <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 p-5 overflow-y-auto flex-shrink-0 bg-slate-50/30 dark:bg-slate-900/20">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Filtros Salvos
                </h3>
                
                {savedFilters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-slate-300 dark:text-slate-600 mb-3">
                      <Filter className="h-8 w-8 mx-auto opacity-40" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Você ainda não possui filtros salvos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedFilters.map((filter) => (
                      <div
                        key={filter.id}
                        className={`p-3 rounded-lg border transition-all group cursor-pointer ${
                          selectedFilterId === filter.id
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700"
                            : "bg-white dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate flex-1">
                            {filter.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setAdvancedFilters(filter.filters)
                              setSelectedFilterId(filter.id)
                              setIsEditingFilter(false)
                              setUnsavedChanges(false)
                            }}
                            className="flex-1 px-2 py-1.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Carregar"
                          >
                            Carregar
                          </button>
                          <button
                            onClick={() => {
                              setAdvancedFilters(filter.filters)
                              setSelectedFilterId(null)
                              setIsEditingFilter(false)
                              setIsDuplicatingFilter(true)
                              setFilterName(`${filter.name} (Cópia)`)
                              setSaveAsFilter(true)
                            }}
                            className="p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors"
                            title="Duplicar"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSavedFilters(savedFilters.filter((f) => f.id !== filter.id))
                              if (selectedFilterId === filter.id) {
                                setSelectedFilterId(null)
                                setIsEditingFilter(false)
                              }
                            }}
                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Filter Configuration with Accordion (70%) */}
              <div className="flex-1 overflow-y-auto p-6 pb-32">
                <Accordion type="multiple" defaultValue={["identificacao", "tipo-status"]} className="space-y-3">
                  
                  {/* SEÇÃO: IDENTIFICAÇÃO */}
                  <AccordionItem value="identificacao" className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/60 px-4 py-3 transition-colors">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Identificação</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-3 bg-white dark:bg-slate-800/50">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Nome da Empresa"
                          value={advancedFilters.name}
                          onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, name: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="CNPJ"
                          value={advancedFilters.cnpj}
                          onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, cnpj: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="E-mail"
                          value={advancedFilters.email}
                          onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, email: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Telefone"
                          value={advancedFilters.phone}
                          onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, phone: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-end">
                        <Input
                          placeholder="WhatsApp"
                          value={advancedFilters.whatsapp}
                          onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, whatsapp: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* SEÇÃO: TIPO E STATUS */}
                  <AccordionItem value="tipo-status" className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/60 px-4 py-3 transition-colors">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Empresa e Status</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-3 bg-white dark:bg-slate-800/50">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Tipo de Empresa</label>
                        <div className="flex flex-wrap gap-2">
                          {["company", "agency", "nomad"].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={advancedFilters.types.includes(type)}
                                onChange={(e) => {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    types: e.target.checked
                                      ? [...advancedFilters.types, type]
                                      : advancedFilters.types.filter((t) => t !== type),
                                  })
                                  if (selectedFilterId) setUnsavedChanges(true)
                                }}
                                className="rounded border-slate-300 dark:border-slate-600"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                                {type === "company" ? "Empresa" : type === "agency" ? "Agência" : "Nômade"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Status</label>
                        <div className="flex flex-wrap gap-2">
                          {["active", "inactive", "pending"].map((status) => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={advancedFilters.statuses.includes(status)}
                                onChange={(e) => {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    statuses: e.target.checked
                                      ? [...advancedFilters.statuses, status]
                                      : advancedFilters.statuses.filter((s) => s !== status),
                                  })
                                  if (selectedFilterId) setUnsavedChanges(true)
                                }}
                                className="rounded border-slate-300 dark:border-slate-600"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {status === "active" ? "Ativo" : status === "inactive" ? "Inativo" : "Pendente"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* SEÇÃO: DATAS */}
                  <AccordionItem value="datas" className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/60 px-4 py-3 transition-colors">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Período de Datas</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-3 bg-white dark:bg-slate-800/50">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Data de Cadastro</label>
                        <div className="flex gap-2">
                          <Input type="date" value={advancedFilters.registrationDateFrom} onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, registrationDateFrom: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }} className="h-8 text-sm flex-1" />
                          <Input type="date" value={advancedFilters.registrationDateTo} onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, registrationDateTo: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }} className="h-8 text-sm flex-1" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Último Acesso</label>
                        <div className="flex gap-2">
                          <Input type="date" value={advancedFilters.lastAccessDateFrom} onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, lastAccessDateFrom: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }} className="h-8 text-sm flex-1" />
                          <Input type="date" value={advancedFilters.lastAccessDateTo} onChange={(e) => {
                            setAdvancedFilters({...advancedFilters, lastAccessDateTo: e.target.value})
                            if (selectedFilterId) setUnsavedChanges(true)
                          }} className="h-8 text-sm flex-1" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex-shrink-0">
              <Button
                onClick={() => {
                  setAdvancedFilters({
                    name: "",
                    cnpj: "",
                    email: "",
                    phone: "",
                    whatsapp: "",
                    types: [],
                    statuses: [],
                    registrationDateFrom: "",
                    registrationDateTo: "",
                    lastAccessDateFrom: "",
                    lastAccessDateTo: "",
                  })
                  setUnsavedChanges(true)
                }}
                variant="outline"
                size="sm"
                className="px-4 py-2 text-sm rounded-lg"
              >
                Limpar
              </Button>

              <div className="flex items-center justify-end gap-3">
                {unsavedChanges && selectedFilterId && (
                  <Button
                    onClick={() => {
                      const updatedFilter = {
                        id: selectedFilterId,
                        name: savedFilters.find((f) => f.id === selectedFilterId)?.name || "",
                        filters: advancedFilters,
                      }
                      setSavedFilters(savedFilters.map((f) => (f.id === selectedFilterId ? updatedFilter : f)))
                      setUnsavedChanges(false)
                    }}
                    size="sm"
                    className="px-4 py-2 text-sm rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Salvar Alterações
                  </Button>
                )}

                {!selectedFilterId || unsavedChanges ? (
                  <Button
                    onClick={() => {
                      if (!filterName && !selectedFilterId) {
                        const newId = `filter-${Date.now()}`
                        const newFilterName = prompt("Nome do filtro:", `Filtro ${savedFilters.length + 1}`)
                        if (newFilterName) {
                          setSavedFilters([...savedFilters, { id: newId, name: newFilterName, filters: advancedFilters }])
                          setSelectedFilterId(newId)
                          setUnsavedChanges(false)
                        }
                      }
                    }}
                    size="sm"
                    className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Salvar Filtro
                  </Button>
                ) : null}

                <Button
                  onClick={() => {
                    if (unsavedChanges) {
                      if (!window.confirm("Você tem alterações não salvas. Deseja sair?")) {
                        return
                      }
                    }
                    setIsFilterModalOpen(false)
                    setSelectedFilterId(null)
                    setIsEditingFilter(false)
                    setUnsavedChanges(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="px-4 py-2 text-sm rounded-lg"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => setIsFilterModalOpen(false)}
                  size="sm"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CompanyCreateSlidePanel
        open={createPanelOpen}
        onOpenChange={setCreatePanelOpen}
        onCreate={handleCreateCompany}
      />

      {selectedCompany && (
        <>
        <CompanyViewSlidePanel
          open={viewPanelOpen}
          onClose={() => {
            setViewPanelOpen(false)
            setSelectedCompany(null)
          }}
          company={selectedCompany}
          onCompanyUpdate={(updatedCompany) => {
            // Update the companies list with the new data
            setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c))
            // Update the selected company to reflect changes
            setSelectedCompany(updatedCompany)
          }}
        />
          <CompanyEditSlidePanel
            open={editPanelOpen}
            onClose={() => {
              setEditPanelOpen(false)
              setSelectedCompany(null)
            }}
            company={selectedCompany}
            onSave={handleSaveCompany}
          />
        </>
      )}
    </div>
  )
}
