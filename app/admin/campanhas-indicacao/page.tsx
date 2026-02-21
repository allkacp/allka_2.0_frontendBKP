
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Plus, Pencil, Trash2, DollarSign, Users, TrendingUp, Target, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import { PageHeader } from "@/components/page-header"

interface Campaign {
  id: string
  name: string
  commissionType: "fixed-first" | "per-referral" | "percentage"
  commissionValue: number
  minReferrals: number
  maxReferrals: number
  activeReferrals: number
  totalEarned: number
  status: "active" | "paused" | "ended"
  startDate: string
  endDate: string
}

export default function CampanhasIndicacaoPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    commissionType: "fixed-first" as Campaign["commissionType"],
    commissionValue: 0,
    minReferrals: 1,
    maxReferrals: 10,
    startDate: "",
    endDate: "",
  })
  
  const [toggleConfirmation, setToggleConfirmation] = useState<{
    campaign: Campaign | null
    newStatus: boolean
  }>({ campaign: null, newStatus: false })

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      name: campaign.name,
      commissionType: campaign.commissionType,
      commissionValue: campaign.commissionValue,
      minReferrals: campaign.minReferrals,
      maxReferrals: campaign.maxReferrals,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
  }

  const handleToggleCampaignStatus = (campaign: Campaign, newStatus: boolean) => {
    setToggleConfirmation({ campaign, newStatus })
  }

  const confirmToggleStatus = async () => {
    if (!toggleConfirmation.campaign) return

    try {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c =>
          c.id === toggleConfirmation.campaign?.id
            ? { ...c, status: toggleConfirmation.newStatus ? 'active' : 'paused' }
            : c
        )
      )

      toast({
        title: 'Sucesso',
        description: `Campanha ${toggleConfirmation.newStatus ? 'ativada' : 'desativada'} com sucesso`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status da campanha',
        variant: 'destructive',
      })
    } finally {
      setToggleConfirmation({ campaign: null, newStatus: false })
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCampaign(null)
    setFormData({
      name: "",
      commissionType: "fixed-first",
      commissionValue: 0,
      minReferrals: 1,
      maxReferrals: 10,
      startDate: "",
      endDate: "",
    })
  }

  const handleSave = () => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => 
        c.id === editingCampaign.id 
          ? { ...c, ...formData }
          : c
      ))
      toast({
        title: "Sucesso",
        description: "Campanha atualizada com sucesso",
      })
    } else {
      const newCampaign: Campaign = {
        id: String(campaigns.length + 1),
        ...formData,
        activeReferrals: 0,
        totalEarned: 0,
        status: "active",
      }
      setCampaigns([...campaigns, newCampaign])
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso",
      })
    }
    handleCloseDialog()
  }

  const isActive = (status: string) => status === 'active'

  const getCommissionTypeLabel = (type: string) => {
    const labels = {
      "fixed-first": "Valor fixo na primeira compra",
      "per-referral": "Comissão por indicação ativa",
      percentage: "Porcentagem sobre vendas",
    }
    return labels[type as keyof typeof labels] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Programa de Indicação Básico",
      commissionType: "fixed-first",
      commissionValue: 100,
      minReferrals: 1,
      maxReferrals: 10,
      activeReferrals: 45,
      totalEarned: 4500,
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    {
      id: "2",
      name: "Indicação Premium",
      commissionType: "per-referral",
      commissionValue: 50,
      minReferrals: 1,
      maxReferrals: 50,
      activeReferrals: 123,
      totalEarned: 6150,
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    {
      id: "3",
      name: "Campanha de Verão",
      commissionType: "percentage",
      commissionValue: 10,
      minReferrals: 5,
      maxReferrals: 100,
      activeReferrals: 67,
      totalEarned: 8900,
      status: "ended",
      startDate: "2023-12-01",
      endDate: "2024-03-31",
    },
  ])

  return (
    <div className="min-h-screen p-6 bg-slate-200 px-0 py-0">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Campanhas de Indicação" 
          description="Configure e gerencie programas de indicação e comissões"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-100 font-medium">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-100 font-medium">Indicações Ativas</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.reduce((sum, c) => sum + c.activeReferrals, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-violet-100 font-medium">Total Pago</p>
                <p className="text-2xl font-bold text-white">
                  R$ {campaigns.reduce((sum, c) => sum + c.totalEarned, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-100 font-medium">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-white">42%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Campanhas Cadastradas</h2>
            <p className="text-sm text-gray-600">Gerencie todas as campanhas de indicação</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingCampaign(null)}>
                <Plus className="h-4 w-4" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? "Editar Campanha" : "Criar Nova Campanha"}</DialogTitle>
                <DialogDescription>Configure os parâmetros da campanha de indicação</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Programa de Indicação Premium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionType">Tipo de Comissão</Label>
                    <Select value={formData.commissionType} onValueChange={(value: Campaign["commissionType"]) => setFormData({ ...formData, commissionType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed-first">Valor fixo na primeira compra</SelectItem>
                        <SelectItem value="per-referral">Comissão por indicação ativa</SelectItem>
                        <SelectItem value="percentage">Porcentagem sobre vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionValue">Valor da Comissão</Label>
                    <Input 
                      id="commissionValue" 
                      type="number" 
                      placeholder="Ex: 100"
                      value={formData.commissionValue}
                      onChange={(e) => setFormData({ ...formData, commissionValue: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minReferrals">Mínimo de Indicações</Label>
                    <Input 
                      id="minReferrals" 
                      type="number" 
                      placeholder="Ex: 1"
                      value={formData.minReferrals}
                      onChange={(e) => setFormData({ ...formData, minReferrals: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxReferrals">Máximo de Indicações</Label>
                    <Input 
                      id="maxReferrals" 
                      type="number" 
                      placeholder="Ex: 50"
                      value={formData.maxReferrals}
                      onChange={(e) => setFormData({ ...formData, maxReferrals: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingCampaign ? "Salvar Edição" : "Criar Campanha"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className={`p-4 hover:shadow-md transition-all border-l-4 ${
                campaign.status === "active"
                  ? "border-l-emerald-500"
                  : campaign.status === "ended"
                    ? "border-l-gray-400"
                    : "border-l-amber-500"
              } ${campaign.status !== "active" ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                    {campaign.status === "active" ? (
                      <Badge variant="outline" className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ativa
                      </Badge>
                    ) : campaign.status === "ended" ? (
                      <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-600 border-gray-300">
                        <XCircle className="h-3 w-3 mr-1" />
                        Encerrada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs font-medium bg-amber-50 text-amber-600 border-amber-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Pausada
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>{getCommissionTypeLabel(campaign.commissionType)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-violet-500" />
                      <span>
                        {campaign.commissionType === "percentage"
                          ? `${campaign.commissionValue}%`
                          : `R$ ${campaign.commissionValue}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-emerald-500" />
                      <span>{campaign.activeReferrals} indicações ativas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      <span>R$ {campaign.totalEarned.toLocaleString()} pagos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-rose-500" />
                      <span>Válida até {formatDate(campaign.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive(campaign.status)}
                      onCheckedChange={(checked) => handleToggleCampaignStatus(campaign, checked)}
                      className={isActive(campaign.status) ? "data-[state=checked]:bg-emerald-500" : ""}
                      disabled={campaign.status === "ended"}
                    />
                    <span className={`text-xs font-medium ${isActive(campaign.status) ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {isActive(campaign.status) ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(campaign)} className="h-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        open={toggleConfirmation.campaign !== null}
        onClose={() => setToggleConfirmation({ campaign: null, newStatus: false })}
        onConfirm={confirmToggleStatus}
        title={toggleConfirmation.newStatus ? 'Ativar Campanha' : 'Desativar Campanha'}
        message={
          toggleConfirmation.newStatus
            ? `Tem certeza que deseja ativar a campanha "${toggleConfirmation.campaign?.name}"? Ela ficará disponível para novos indicados.`
            : `Tem certeza que deseja desativar a campanha "${toggleConfirmation.campaign?.name}"? Novas indicações não serão aceitas.`
        }
        confirmText={toggleConfirmation.newStatus ? 'Ativar' : 'Desativar'}
        destructive={!toggleConfirmation.newStatus}
      />
    </div>
  )
}
