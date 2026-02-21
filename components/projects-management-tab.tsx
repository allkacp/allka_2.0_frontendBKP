import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PaginationControls } from "@/components/pagination-controls"
import { ProjectManagementModal } from "@/components/project-management-modal"
import { Eye, Copy, FileText, Edit, Ban, ExternalLink, Search, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Project {
  id: number
  name: string
  client: string
  clientCNPJ: string
  agency: string
  consultant: string
  consultantEmail: string
  type: string
  status: string
  progress: number
  budget: number
  spent: number
  createdDate: string
  startDate: string
  deadline: string
  team: number
  nomades: string[]
  bitrixSync: boolean
  portfolioPermission: boolean
  overdue: boolean
  value: number
  fromLead: boolean
  companyId?: number
}

interface ProjectsManagementTabProps {
  company: {
    id: string
    name: string
  }
}

// Mock de projetos - em produção viriam da API
const mockAllProjects: Project[] = [
  {
    id: 1,
    name: "Hospedagem Florescer Idosos",
    client: "Florescer",
    clientCNPJ: "12.345.678/0001-90",
    agency: "Lamego Academy",
    consultant: "Equipe Lamego",
    consultantEmail: "contato@lamego.com.vc",
    type: "Marketing Digital",
    status: "awaiting-payment",
    progress: 65,
    budget: 15000,
    spent: 9750,
    createdDate: "19/02/2025",
    startDate: "2024-01-15",
    deadline: "2024-03-30",
    team: 5,
    nomades: ["Ana Santos", "Carlos Lima"],
    bitrixSync: false,
    portfolioPermission: false,
    overdue: false,
    value: 15000,
    fromLead: true,
    companyId: 1,
  },
  {
    id: 2,
    name: "Redesign Website Startup ABC",
    client: "Startup ABC",
    clientCNPJ: "98.765.432/0001-10",
    agency: "Design Studio",
    consultant: "Maria Designer",
    consultantEmail: "maria@designstudio.com",
    type: "Desenvolvimento Web",
    status: "in-progress",
    progress: 45,
    budget: 25000,
    spent: 11250,
    createdDate: "15/01/2025",
    startDate: "2024-02-01",
    deadline: "2024-05-15",
    team: 3,
    nomades: ["Maria Silva", "João Dev"],
    bitrixSync: true,
    portfolioPermission: true,
    overdue: false,
    value: 25000,
    fromLead: false,
    companyId: 1,
  },
  {
    id: 3,
    name: "Identidade Visual FoodCorp",
    client: "FoodCorp",
    clientCNPJ: "11.222.333/0001-44",
    agency: "Creative Partners",
    consultant: "Pedro Criativo",
    consultantEmail: "pedro@creative.com",
    type: "Design",
    status: "completed",
    progress: 100,
    budget: 8000,
    spent: 7800,
    createdDate: "10/12/2024",
    startDate: "2023-12-10",
    deadline: "2024-01-20",
    team: 2,
    nomades: ["Ana Santos"],
    bitrixSync: true,
    portfolioPermission: false,
    overdue: false,
    value: 8000,
    fromLead: true,
    companyId: 1,
  },
  {
    id: 4,
    name: "Campanha Lançamento Produto XYZ",
    client: "Tech Innovations",
    clientCNPJ: "22.333.444/0001-55",
    agency: "Marketing Pro",
    consultant: "Lucas Marketing",
    consultantEmail: "lucas@marketingpro.com",
    type: "Marketing Digital",
    status: "negotiation",
    progress: 20,
    budget: 32000,
    spent: 6400,
    createdDate: "05/02/2025",
    startDate: "2024-03-01",
    deadline: "2024-06-30",
    team: 4,
    nomades: ["Carlos Lima", "Ana Santos"],
    bitrixSync: true,
    portfolioPermission: true,
    overdue: false,
    value: 32000,
    fromLead: true,
    companyId: 1,
  },
  {
    id: 5,
    name: "Desenvolvimento App Mobile E-commerce",
    client: "E-Shop Brasil",
    clientCNPJ: "55.666.777/0001-88",
    agency: "Tech Solutions",
    consultant: "Rafael Dev",
    consultantEmail: "rafael@techsolutions.com",
    type: "Desenvolvimento Mobile",
    status: "planning",
    progress: 10,
    budget: 45000,
    spent: 4500,
    createdDate: "25/01/2025",
    startDate: "2024-03-15",
    deadline: "2024-10-30",
    team: 6,
    nomades: ["João Dev", "Maria Silva", "Carlos Dev"],
    bitrixSync: true,
    portfolioPermission: true,
    overdue: false,
    value: 45000,
    fromLead: true,
    companyId: 1,
  },
  {
    id: 6,
    name: "Consultoria Estratégica Digital Cancelada",
    client: "Old Corp",
    clientCNPJ: "33.444.555/0001-66",
    agency: "Consulting Plus",
    consultant: "Joana Consultora",
    consultantEmail: "joana@consulting.com",
    type: "Consultoria",
    status: "canceled",
    progress: 30,
    budget: 18000,
    spent: 5400,
    createdDate: "01/12/2024",
    startDate: "2024-01-10",
    deadline: "2024-04-10",
    team: 2,
    nomades: ["Ana Santos"],
    bitrixSync: false,
    portfolioPermission: false,
    overdue: true,
    value: 18000,
    fromLead: false,
    companyId: 1,
  },
]

export function ProjectsManagementTab({ company }: ProjectsManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")

  // Filtrar projetos por empresa
  const companyProjects = useMemo(() => {
    return mockAllProjects.filter(
      (project) =>
        project.client.toLowerCase() === company.name.toLowerCase() ||
        project.companyId === parseInt(company.id)
    )
  }, [company.id, company.name])

  // Filtrar projetos baseado em search, status e tipo
  const filteredProjects = useMemo(() => {
    return companyProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || project.status === filterStatus

      const matchesType = filterType === "all" || project.type === filterType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [companyProjects, searchTerm, filterStatus, filterType])

  // Paginação
  const totalProjects = filteredProjects.length
  const totalPages = Math.ceil(totalProjects / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting-payment":
        return <Badge className="bg-cyan-500 text-white text-[10px] px-2 py-0.5">AGUARDANDO PAGAMENTO</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500 text-white text-[10px] px-2 py-0.5">EM ANDAMENTO</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white text-[10px] px-2 py-0.5">CONCLUÍDO</Badge>
      case "negotiation":
        return <Badge className="bg-gray-500 text-white text-[10px] px-2 py-0.5">NEGOCIAÇÃO</Badge>
      case "planning":
        return <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0.5">PLANEJAMENTO</Badge>
      case "canceled":
        return <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5">CANCELADO</Badge>
      case "draft":
        return <Badge className="bg-slate-500 text-white text-[10px] px-2 py-0.5">RASCUNHO</Badge>
      default:
        return <Badge className="bg-gray-500 text-white text-[10px] px-2 py-0.5">{status.toUpperCase()}</Badge>
    }
  }

  const allTypes = ["Marketing Digital", "Desenvolvimento Web", "Design", "Consultoria", "E-commerce", "Desenvolvimento Mobile"]
  const allStatuses = [
    { value: "awaiting-payment", label: "Aguardando Pagamento" },
    { value: "in-progress", label: "Em Andamento" },
    { value: "completed", label: "Concluído" },
    { value: "negotiation", label: "Negociação" },
    { value: "planning", label: "Planejamento" },
    { value: "canceled", label: "Cancelado" },
  ]

  // Handlers para o modal de projeto
  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode("view")
    setModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode("edit")
    setModalOpen(true)
  }

  const handleCloneProject = (project: Project) => {
    console.log("Clonando projeto:", project.name)
    // TODO: Implementar lógica de clonagem de projeto
  }

  const handleExportProject = (project: Project) => {
    console.log("Exportando proposta do projeto:", project.name)
    // TODO: Implementar lógica de exportação de proposta
  }

  const handleCancelProject = (project: Project) => {
    console.log("Cancelando projeto:", project.name)
    // TODO: Implementar lógica de cancelamento de projeto
  }

  const handleSaveProjectChanges = (updatedProject: Project) => {
    setSelectedProject(updatedProject)
    setModalMode("view")
    // TODO: Implementar lógica de salvamento de alterações do projeto
  }

  return (
    <div className="space-y-4">
      {/* Controle de Paginação - Topo */}
      {totalProjects > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-gray-600">
            Exibindo <span className="font-semibold">{startIndex + 1}</span> a <span className="font-semibold">{Math.min(endIndex, totalProjects)}</span> de <span className="font-semibold">{totalProjects}</span> projetos
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Itens por página:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome do projeto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 bg-transparent text-sm focus-visible:ring-0"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {allStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {allTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listagem de Projetos */}
      {paginatedProjects.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <p className="text-gray-500 text-sm">Nenhum projeto encontrado para esta empresa.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Accordion type="multiple" className="space-y-2">
            {paginatedProjects.map((project) => (
              <AccordionItem key={project.id} value={`project-${project.id}`} className="border rounded-lg bg-white">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-4 flex-1">
                      <h3 className="text-sm font-semibold text-left">{project.name}</h3>
                      {getStatusBadge(project.status)}
                      <span className="text-xs text-gray-500">
                        Cliente: <span className="font-medium text-blue-600">{project.client}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mr-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="Visualizar Projeto"
                        onClick={() => handleViewProject(project)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Clonar Projeto"
                        onClick={() => handleCloneProject(project)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Exportar Proposta"
                        onClick={() => handleExportProject(project)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        title="Editar Projeto"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                        title="Cancelar Projeto"
                        onClick={() => handleCancelProject(project)}
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 mb-3 text-xs pt-2">
                    <div>
                      <span className="text-gray-500">Checkout Agência</span>
                      <div className="mt-0.5">
                        <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                          Acessar Checkout Agência
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Checkout Cliente</span>
                      <div className="mt-0.5">
                        <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                          Acessar Checkout Cliente
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">CNPJ</span>
                      <div className="mt-0.5 font-medium">{project.clientCNPJ}</div>
                    </div>

                    <div>
                      <span className="text-gray-500">Agência</span>
                      <div className="mt-0.5">
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          {project.agency}
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Consultor Responsável</span>
                      <div className="mt-0.5 font-medium">{project.consultant}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">E-mail do Consultor</span>
                      <div className="mt-0.5 font-medium">{project.consultantEmail}</div>
                    </div>

                    <div>
                      <span className="text-gray-500">Data de Criação</span>
                      <div className="mt-0.5 font-medium">{project.createdDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Sincronizado Bitrix</span>
                      <div className="mt-0.5">
                        <Badge
                          variant={project.bitrixSync ? "default" : "destructive"}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {project.bitrixSync ? "SIM" : "NÃO"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Portfólio</span>
                      <div className="mt-0.5">
                        <Badge
                          variant={project.portfolioPermission ? "default" : "destructive"}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {project.portfolioPermission ? "SIM" : "NÃO"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 pt-3 border-t grid-cols-2 md:grid-cols-6">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Progresso</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{project.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Orçamento</span>
                      <p className="text-sm font-bold mt-1">R$ {project.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Gasto</span>
                      <p className="text-sm font-bold text-orange-600 mt-1">R$ {project.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Início</span>
                      <p className="text-sm font-bold mt-1">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Prazo</span>
                      <p className="text-sm font-bold mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase">Equipe</span>
                      <p className="text-sm font-bold mt-1">{project.team} membros</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <span className="text-[10px] text-gray-500 uppercase">Nômades Alocados</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {project.nomades.map((nomade, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] px-2 py-0.5">
                          {nomade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Paginação */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProjects}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      {/* Modal de Gestão de Projeto */}
      <ProjectManagementModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        onEdit={() => handleEditProject(selectedProject!)}
        onClone={() => handleCloneProject(selectedProject!)}
        onExport={() => handleExportProject(selectedProject!)}
        onSave={handleSaveProjectChanges}
        onCancel={() => handleCancelProject(selectedProject!)}
      />
    </div>
  )
}
