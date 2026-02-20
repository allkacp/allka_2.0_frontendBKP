"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Tag, Plus, Pencil, Trash2, Percent, DollarSign, Calendar, Users, TrendingUp, Power, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from "@/components/page-header"

interface Coupon {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: string
  validUntil: string
  usageLimit: number
  usedCount: number
  applicableProducts: string[]
  status: "active" | "expired" | "disabled"
}

export default function PromocoesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const { toast } = useToast()
  
  const [toggleConfirmation, setToggleConfirmation] = useState<{
    coupon: Coupon | null
    newStatus: boolean
  }>({ coupon: null, newStatus: false })

  // Mock data
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "WELCOME20",
      discountType: "percentage",
      discountValue: 20,
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      usageLimit: 1000,
      usedCount: 234,
      applicableProducts: ["Todos os produtos"],
      status: "active",
    },
    {
      id: "2",
      code: "FIRST50",
      discountType: "fixed",
      discountValue: 50,
      validFrom: "2024-01-01",
      validUntil: "2024-06-30",
      usageLimit: 500,
      usedCount: 456,
      applicableProducts: ["Primeira compra"],
      status: "active",
    },
    {
      id: "3",
      code: "SUMMER2023",
      discountType: "percentage",
      discountValue: 15,
      validFrom: "2023-06-01",
      validUntil: "2023-09-30",
      usageLimit: 2000,
      usedCount: 1847,
      applicableProducts: ["Todos os produtos"],
      status: "expired",
    },
  ])

  const stats = [
    {
      label: "Cupons Ativos",
      value: coupons.filter((c) => c.status === "active").length,
      icon: Tag,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      label: "Total de Usos",
      value: coupons.reduce((sum, c) => sum + c.usedCount, 0),
      icon: Users,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
    },
    {
      label: "Taxa de Conversão",
      value: "68%",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      label: "Desconto Médio",
      value: "R$ 45",
      icon: DollarSign,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
  ]

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id))
  }

  const handleToggleCouponStatus = (coupon: Coupon, newStatus: boolean) => {
    setToggleConfirmation({ coupon, newStatus })
  }

  const confirmToggleStatus = async () => {
    if (!toggleConfirmation.coupon) return

    try {
      // Update the coupon status
      setCoupons(prevCoupons =>
        prevCoupons.map(c =>
          c.id === toggleConfirmation.coupon?.id
            ? { ...c, status: toggleConfirmation.newStatus ? 'active' : 'disabled' }
            : c
        )
      )

      toast({
        title: 'Sucesso',
        description: `Cupom ${toggleConfirmation.newStatus ? 'ativado' : 'desativado'} com sucesso`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status do cupom',
        variant: 'destructive',
      })
    } finally {
      setToggleConfirmation({ coupon: null, newStatus: false })
    }
  }

  const isActive = (status: string) => status === 'active'

  return (
    <div className="min-h-screen p-6 px-0 py-0 bg-slate-200">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Promoções e Cupons" 
          description="Gerencie cupons de desconto e promoções da plataforma"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-100 font-medium">Cupons Ativos</p>
                <p className="text-2xl font-bold text-white">
                  {coupons.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-violet-100 font-medium">Total de Usos</p>
                <p className="text-2xl font-bold text-white">
                  {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
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
                <p className="text-2xl font-bold text-white">68%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-rose-100 font-medium">Desconto Médio</p>
                <p className="text-2xl font-bold text-white">R$ 45</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cupons Cadastrados</h2>
            <p className="text-sm text-gray-600">Gerencie todos os cupons de desconto</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Cupom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Cupom</DialogTitle>
                <DialogDescription>Preencha os dados do cupom de desconto</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código do Cupom</Label>
                    <Input id="code" placeholder="Ex: WELCOME20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Tipo de Desconto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentagem</SelectItem>
                        <SelectItem value="fixed">Valor Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Valor do Desconto</Label>
                    <Input id="discountValue" type="number" placeholder="Ex: 20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Limite de Uso</Label>
                    <Input id="usageLimit" type="number" placeholder="Ex: 1000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Válido De</Label>
                    <Input id="validFrom" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Válido Até</Label>
                    <Input id="validUntil" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="products">Produtos Aplicáveis</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os produtos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os produtos</SelectItem>
                      <SelectItem value="first">Primeira compra</SelectItem>
                      <SelectItem value="specific">Produtos específicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Criar Cupom
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {coupons.map((coupon) => (
            <Card
              key={coupon.id}
              className={`p-4 hover:shadow-md transition-all border-l-4 ${
                coupon.status === "active"
                  ? "border-l-emerald-500"
                  : coupon.status === "expired"
                    ? "border-l-gray-400"
                    : "border-l-rose-500"
              } ${coupon.status !== "active" ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{coupon.code}</h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {coupon.discountType === "percentage" ? (
                        <>
                          <Percent className="h-3 w-3 mr-1" />
                          {coupon.discountValue}% OFF
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-3 w-3 mr-1" />
                          R$ {coupon.discountValue} OFF
                        </>
                      )}
                    </Badge>
                    {coupon.status === "active" ? (
                      <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : coupon.status === "expired" ? (
                      <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-600 border-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Expirado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs font-medium bg-rose-50 text-rose-600 border-rose-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Desativado
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {new Date(coupon.validFrom).toLocaleDateString("pt-BR")} -{" "}
                        {new Date(coupon.validUntil).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-violet-500" />
                      <span>
                        {coupon.usedCount} / {coupon.usageLimit} usos
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-emerald-500" />
                      <span>{coupon.applicableProducts.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive(coupon.status)}
                      onCheckedChange={(checked) => handleToggleCouponStatus(coupon, checked)}
                      className={isActive(coupon.status) ? "data-[state=checked]:bg-emerald-500" : ""}
                    />
                    <span className={`text-xs font-medium ${isActive(coupon.status) ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {isActive(coupon.status) ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon)} className="h-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
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
        open={toggleConfirmation.coupon !== null}
        onClose={() => setToggleConfirmation({ coupon: null, newStatus: false })}
        onConfirm={confirmToggleStatus}
        title={toggleConfirmation.newStatus ? 'Ativar Cupom' : 'Desativar Cupom'}
        message={
          toggleConfirmation.newStatus
            ? `Tem certeza que deseja ativar o cupom "${toggleConfirmation.coupon?.code}"? Ele ficará disponível para uso.`
            : `Tem certeza que deseja desativar o cupom "${toggleConfirmation.coupon?.code}"? Ele não poderá mais ser utilizado.`
        }
        confirmText={toggleConfirmation.newStatus ? 'Ativar' : 'Desativar'}
        destructive={!toggleConfirmation.newStatus}
      />
    </div>
  )
}
