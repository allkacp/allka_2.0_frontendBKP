"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { X, Building2, Mail, Phone, MapPin, CreditCard, User, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/contexts/sidebar-context"
import { ModalBrandHeader } from "@/components/ui/modal-brand-header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AddressMapPicker } from "@/components/address/address-map-picker"
import { CompanyStatusSelector } from "@/components/company-status-selector"
import { CompanySocialLinksManager, type SocialLink } from "@/components/company-social-links-manager"

type CompanyStatus = "active" | "inactive" | "pending"

interface CompanyCreateSlidePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (company: any) => void
}

interface FormData {
  // Dados Cadastrais
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual: string
  status: CompanyStatus

  // Contato
  emailPrincipal: string
  telefone: string

  // Redes Sociais
  socialLinks: SocialLink[]

  // Endereço
  cep: string
  rua: string
  numero: string
  complemento: string
  cidade: string
  estado: string
  latitude?: number
  longitude?: number
  place_id?: string
  formatted_address?: string

  // Tipo de Conta
  tipoContato: "dependent" | "independent" | "agency" | "partner"

  // Plano de Créditos
  planoCreditoId: string
  limite: string
  creditosIniciais: string

  // Métodos de Pagamento
  metodoPagamento: string

  // Usuário Administrador
  nomeAdmin: string
  emailAdmin: string
}

interface FormErrors {
  [key: string]: string
}

export function CompanyCreateSlidePanel({ open, onOpenChange, onCreate }: CompanyCreateSlidePanelProps) {
  const { toast } = useToast()
  const { sidebarCollapsed } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    status: "active",
    emailPrincipal: "",
    telefone: "",
    socialLinks: [],
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    latitude: undefined,
    longitude: undefined,
    place_id: undefined,
    formatted_address: undefined,
    tipoContato: "independent",
    planoCreditoId: "starter",
    limite: "1000",
    creditosIniciais: "100",
    metodoPagamento: "pix",
    nomeAdmin: "",
    emailAdmin: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      setFormData({
        razaoSocial: "",
        nomeFantasia: "",
        cnpj: "",
        inscricaoEstadual: "",
        status: "active",
        emailPrincipal: "",
        telefone: "",
        socialLinks: [],
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        cidade: "",
        estado: "",
        tipoContato: "independent",
        planoCreditoId: "starter",
        limite: "1000",
        creditosIniciais: "100",
        metodoPagamento: "pix",
        nomeAdmin: "",
        emailAdmin: "",
      })
      setErrors({})
    }
  }, [open])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.razaoSocial.trim()) newErrors.razaoSocial = "Razão Social é obrigatória"
    if (!formData.nomeFantasia.trim()) newErrors.nomeFantasia = "Nome Fantasia é obrigatório"
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório"
    if (!formData.emailPrincipal.trim()) {
      newErrors.emailPrincipal = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.emailPrincipal)) {
      newErrors.emailPrincipal = "Email inválido"
    }
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório"
    if (!formData.rua.trim()) newErrors.rua = "Rua é obrigatória"
    if (!formData.numero.trim()) newErrors.numero = "Número é obrigatório"
    if (!formData.cidade.trim()) newErrors.cidade = "Cidade é obrigatória"
    if (!formData.estado.trim()) newErrors.estado = "Estado é obrigatório"
    if (!formData.nomeAdmin.trim()) newErrors.nomeAdmin = "Nome do Admin é obrigatório"
    if (!formData.emailAdmin.trim()) {
      newErrors.emailAdmin = "Email do Admin é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAdmin)) {
      newErrors.emailAdmin = "Email do Admin inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmSubmit = async () => {
    setLoading(true)
    setShowConfirmDialog(false)

    try {
      const companyData = {
        id: Date.now().toString(),
        razaoSocial: formData.razaoSocial,
        nomeFantasia: formData.nomeFantasia,
        cnpj: formData.cnpj,
        inscricaoEstadual: formData.inscricaoEstadual,
        status: formData.status,
        emailPrincipal: formData.emailPrincipal,
        telefone: formData.telefone,
        socialLinks: formData.socialLinks,
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          cidade: formData.cidade,
          estado: formData.estado,
        },
        tipoContato: formData.tipoContato,
        planoCreditoId: formData.planoCreditoId,
        limite: parseInt(formData.limite),
        creditosIniciais: parseInt(formData.creditosIniciais),
        metodoPagamento: formData.metodoPagamento,
        adminInicial: {
          nome: formData.nomeAdmin,
          email: formData.emailAdmin,
          perfil: "administrador",
        },
        createdAt: new Date().toISOString(),
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      })

      onCreate(companyData)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar empresa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | CompanyStatus) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const panelWidth = sidebarCollapsed ? "calc(100vw - 4rem)" : "calc(100vw - 16rem)"

  if (!mounted) return null

  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-white flex flex-col border-l border-gray-200 z-50 shadow-2xl",
          "transform transition-transform duration-500 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width: panelWidth }}
      >
        {/* Header with Brand Theme */}
        <ModalBrandHeader
          title="Nova Empresa"
          left={
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-200">Configure os dados da empresa</p>
              </div>
            </div>
          }
          right={
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg opacity-100 transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:pointer-events-none p-1.5"
              title="Fechar"
            >
              <X className="h-6 w-6 text-white drop-shadow-md" />
              <span className="sr-only">Fechar</span>
            </button>
          }
        />

        {/* Conteúdo com Abas em Accordions */}
        <div className="flex-1 overflow-y-auto p-6 app-brand-soft">
          {/* STATUS HEADER - Prominently displayed at the top */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm">
            <CompanyStatusSelector
              value={formData.status}
              onChange={(status) => updateField("status", status)}
            />
          </div>

          <Accordion type="single" collapsible defaultValue="cadastrais" className="space-y-3">
            {/* SEÇÃO 1: DADOS CADASTRAIS */}
            <AccordionItem value="cadastrais" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700">1</Badge>
                  Dados Cadastrais da Empresa
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold">Razão Social *</Label>
                    <Input
                      placeholder="Empresa LTDA"
                      value={formData.razaoSocial}
                      onChange={(e) => updateField("razaoSocial", e.target.value)}
                      className={errors.razaoSocial ? "border-red-500" : ""}
                    />
                    {errors.razaoSocial && <p className="text-xs text-red-500 mt-1">{errors.razaoSocial}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label className="text-sm font-semibold">Nome Fantasia *</Label>
                    <Input
                      placeholder="Empresa"
                      value={formData.nomeFantasia}
                      onChange={(e) => updateField("nomeFantasia", e.target.value)}
                      className={errors.nomeFantasia ? "border-red-500" : ""}
                    />
                    {errors.nomeFantasia && <p className="text-xs text-red-500 mt-1">{errors.nomeFantasia}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">CNPJ *</Label>
                    <Input
                      placeholder="12.345.678/0001-90"
                      value={formData.cnpj}
                      onChange={(e) => updateField("cnpj", e.target.value)}
                      className={errors.cnpj ? "border-red-500" : ""}
                    />
                    {errors.cnpj && <p className="text-xs text-red-500 mt-1">{errors.cnpj}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Inscrição Estadual</Label>
                    <Input
                      placeholder="(Opcional)"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => updateField("inscricaoEstadual", e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 2: CONTATO */}
            <AccordionItem value="contato" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">2</Badge>
                  Contato
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Email Principal *</Label>
                    <Input
                      type="email"
                      placeholder="contact@empresa.com"
                      value={formData.emailPrincipal}
                      onChange={(e) => updateField("emailPrincipal", e.target.value)}
                      className={errors.emailPrincipal ? "border-red-500" : ""}
                    />
                    {errors.emailPrincipal && <p className="text-xs text-red-500 mt-1">{errors.emailPrincipal}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Telefone *</Label>
                    <Input
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={(e) => updateField("telefone", e.target.value)}
                      className={errors.telefone ? "border-red-500" : ""}
                    />
                    {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 3: REDES SOCIAIS */}
            <AccordionItem value="social" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700">3</Badge>
                  Redes Sociais
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <CompanySocialLinksManager
                  socialLinks={formData.socialLinks}
                  onChange={(links) => updateField("socialLinks", links)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 4: ENDEREÇO */}
            <AccordionItem value="endereco" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-700">4</Badge>
                  Endereço
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6">
                {/* Seletor de Endereço com Mapa */}
                <div className="col-span-2">
                  <Label className="text-sm font-semibold mb-3 block">Localização (Selecione no Mapa) *</Label>
                  <AddressMapPicker
                    address={{
                      street: formData.rua,
                      number: formData.numero,
                      district: formData.complemento,
                      city: formData.cidade,
                      state: formData.estado,
                      zipcode: formData.cep,
                      lat: formData.latitude,
                      lng: formData.longitude,
                    }}
                    onAddressChange={(address) => {
                      updateField("rua", address.street)
                      updateField("numero", address.number)
                      updateField("complemento", address.district)
                      updateField("cidade", address.city)
                      updateField("estado", address.state)
                      updateField("cep", address.zipcode)
                      updateField("latitude", address.lat)
                      updateField("longitude", address.lng)
                      if (address.placeId) updateField("place_id", address.placeId)
                      if (address.formatted) updateField("formatted_address", address.formatted)
                    }}
                  />
                </div>

                {/* Campos Manuais (para correção rápida) */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 mb-4">Você também pode editar os campos abaixo manualmente</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">CEP</Label>
                      <Input
                        placeholder="01310-100"
                        value={formData.cep}
                        onChange={(e) => updateField("cep", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">Rua *</Label>
                      <Input
                        placeholder="Avenida Paulista"
                        value={formData.rua}
                        onChange={(e) => updateField("rua", e.target.value)}
                        className={errors.rua ? "border-red-500" : ""}
                      />
                      {errors.rua && <p className="text-xs text-red-500 mt-1">{errors.rua}</p>}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Número *</Label>
                      <Input
                        placeholder="1000"
                        value={formData.numero}
                        onChange={(e) => updateField("numero", e.target.value)}
                        className={errors.numero ? "border-red-500" : ""}
                      />
                      {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Complemento</Label>
                      <Input
                        placeholder="Apto 1000"
                        value={formData.complemento}
                        onChange={(e) => updateField("complemento", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Cidade *</Label>
                      <Input
                        placeholder="São Paulo"
                        value={formData.cidade}
                        onChange={(e) => updateField("cidade", e.target.value)}
                        className={errors.cidade ? "border-red-500" : ""}
                      />
                      {errors.cidade && <p className="text-xs text-red-500 mt-1">{errors.cidade}</p>}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Estado *</Label>
                      <Select value={formData.estado} onValueChange={(value) => updateField("estado", value)}>
                        <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 5: TIPO DE CONTA */}
            <AccordionItem value="tipoConta" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-700">5</Badge>
                  Tipo de Conta
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-3">
                <RadioGroup
                  value={formData.tipoContato}
                  onValueChange={(value) => updateField("tipoContato", value)}
                  className="space-y-3"
                >
                  <Card className="p-3 border-l-4 border-l-blue-500 cursor-pointer hover:bg-blue-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="dependent" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Company Dependente</p>
                        <p className="text-xs text-gray-600">Empresa gerenciada por outra company</p>
                      </div>
                    </label>
                  </Card>

                  <Card className="p-3 border-l-4 border-l-green-500 cursor-pointer hover:bg-green-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="independent" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Company Independente</p>
                        <p className="text-xs text-gray-600">Empresa com autonomia total</p>
                      </div>
                    </label>
                  </Card>

                  <Card className="p-3 border-l-4 border-l-purple-500 cursor-pointer hover:bg-purple-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="agency" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Agency</p>
                        <p className="text-xs text-gray-600">Agência gestora de múltiplos projetos</p>
                      </div>
                    </label>
                  </Card>

                  <Card className="p-3 border-l-4 border-l-red-500 cursor-pointer hover:bg-red-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="partner" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Partner</p>
                        <p className="text-xs text-gray-600">Parceiro de plataforma</p>
                      </div>
                    </label>
                  </Card>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 6: PLANO DE CRÉDITOS */}
            <AccordionItem value="plano" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-700">6</Badge>
                  Plano de Créditos
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Selecionar Plano</Label>
                    <Select value={formData.planoCreditoId} onValueChange={(value) => updateField("planoCreditoId", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter (100 créditos)</SelectItem>
                        <SelectItem value="growth">Growth (500 créditos)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (1000 créditos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Limite de Créditos</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={formData.limite}
                        onChange={(e) => updateField("limite", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Créditos Iniciais</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={formData.creditosIniciais}
                        onChange={(e) => updateField("creditosIniciais", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 7: MÉTODOS DE PAGAMENTO */}
            <AccordionItem value="pagamento" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-cyan-100 text-cyan-700">7</Badge>
                  Métodos de Pagamento
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Método Padrão</Label>
                  <RadioGroup
                    value={formData.metodoPagamento}
                    onValueChange={(value) => updateField("metodoPagamento", value)}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value="pix" />
                      <span className="text-sm">PIX</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value="boleto" />
                      <span className="text-sm">Boleto</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value="cartao" />
                      <span className="text-sm">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value="allkoin" />
                      <span className="text-sm">ALLKOIN</span>
                    </label>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SEÇÃO 8: USUÁRIO ADMINISTRADOR */}
            <AccordionItem value="admin" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Badge className="bg-rose-100 text-rose-700">8</Badge>
                  Usuário Administrador Inicial
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 text-xs text-blue-700 mb-4">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Este será o primeiro usuário com acesso total à empresa</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Nome do Administrador *</Label>
                    <Input
                      placeholder="João Silva"
                      value={formData.nomeAdmin}
                      onChange={(e) => updateField("nomeAdmin", e.target.value)}
                      className={errors.nomeAdmin ? "border-red-500" : ""}
                    />
                    {errors.nomeAdmin && <p className="text-xs text-red-500 mt-1">{errors.nomeAdmin}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Email do Administrador *</Label>
                    <Input
                      type="email"
                      placeholder="joao@empresa.com"
                      value={formData.emailAdmin}
                      onChange={(e) => updateField("emailAdmin", e.target.value)}
                      className={errors.emailAdmin ? "border-red-500" : ""}
                    />
                    {errors.emailAdmin && <p className="text-xs text-red-500 mt-1">{errors.emailAdmin}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Perfil</Label>
                    <Input disabled defaultValue="Administrador" className="bg-gray-50 text-gray-600" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              A empresa será criada e o usuário administrador receberá um convite por email para configurar sua senha.
            </p>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Empresa"}
          </Button>
        </div>
      </div>

      {/* Diálogo de Confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Criação de Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente criar a empresa <strong>{formData.nomeFantasia}</strong> com as configurações informadas?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} className="bg-blue-600 hover:bg-blue-700">
              Criar Empresa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
