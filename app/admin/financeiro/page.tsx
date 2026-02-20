"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"

const mockFinancialData = {
  summary: {
    totalRevenue: 485000,
    totalExpenses: 312000,
    taxes: 48500, // 10% tax rate
    grossProfit: 124500, // Revenue - Expenses - Taxes
    netProfit: 173000,
    pendingPayments: 45000,
    monthlyGrowth: 12.5,
  },
  wallet: {
    totalBalance: 285000,
    pendingRevenue: 125000,
    pendingExpenses: 78000,
    availableBalance: 207000,
  },
  postPaidClients: [
    {
      id: 1,
      name: "TechCorp Squad",
      overdraftLimit: 50000,
      currentBalance: -32000,
      invoiceDate: "2024-03-31",
      paymentDue: "2024-04-10",
      status: "active",
    },
    {
      id: 2,
      name: "StartupXYZ Squad",
      overdraftLimit: 30000,
      currentBalance: -18500,
      invoiceDate: "2024-03-31",
      paymentDue: "2024-04-10",
      status: "active",
    },
    {
      id: 3,
      name: "DesignHub Squad",
      overdraftLimit: 40000,
      currentBalance: -25000,
      invoiceDate: "2024-03-31",
      paymentDue: "2024-04-10",
      status: "pending",
    },
  ],
  bankReconciliation: [
    {
      id: 1,
      date: "2024-03-15",
      description: "Transferência TechStore",
      amount: 15000,
      paymentMethod: "Transferência Bancária",
      status: "reconciled",
      category: "Receita",
    },
    {
      id: 2,
      date: "2024-03-14",
      description: "Pagamento Nômades",
      amount: -45000,
      paymentMethod: "PIX",
      status: "reconciled",
      category: "Despesa",
    },
    {
      id: 3,
      date: "2024-03-13",
      description: "Entrada não identificada",
      amount: 8500,
      paymentMethod: "Transferência Bancária",
      status: "pending",
      category: "Não identificado",
    },
    {
      id: 4,
      date: "2024-03-12",
      description: "Comissões Líderes",
      amount: -12000,
      paymentMethod: "Transferência Bancária",
      status: "reconciled",
      category: "Despesa",
    },
  ],
  walletTransactions: [
    {
      id: 1,
      type: "income",
      description: "Pagamento Projeto - TechStore",
      amount: 15000,
      date: "2024-03-15",
      status: "completed",
      category: "Projetos",
    },
    {
      id: 2,
      type: "expense",
      description: "Pagamento Nômades - Março",
      amount: 45000,
      date: "2024-03-14",
      status: "completed",
      category: "Salários",
    },
    {
      id: 3,
      type: "income",
      description: "Assinatura Mensal - Startup ABC",
      amount: 8500,
      date: "2024-03-13",
      status: "completed",
      category: "Assinaturas",
    },
    {
      id: 4,
      type: "expense",
      description: "Comissões Líderes",
      amount: 12000,
      date: "2024-03-12",
      status: "completed",
      category: "Comissões",
    },
    {
      id: 5,
      type: "income",
      description: "Projeto Concluído - FoodCorp",
      amount: 7800,
      date: "2024-03-11",
      status: "pending",
      category: "Projetos",
    },
  ],
  revenueBySource: [
    { source: "Projetos Empresas", amount: 285000, percentage: 58.8 },
    { source: "Projetos Agências", amount: 145000, percentage: 29.9 },
    { source: "Produtos Catálogo", amount: 55000, percentage: 11.3 },
  ],
  expenses: [
    { category: "Salários Nômades", amount: 185000, percentage: 59.3 },
    { category: "Comissões Líderes", amount: 45000, percentage: 14.4 },
    { category: "Impostos", amount: 48500, percentage: 15.5 }, // Added taxes as expense
    { category: "Infraestrutura", amount: 35000, percentage: 11.2 },
    { category: "Marketing", amount: 28000, percentage: 9.0 },
    { category: "Operacional", amount: 19000, percentage: 6.1 },
  ],
}

export default function AdminFinanceiroPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="container mx-auto space-y-6 px-0 py-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl">
            Gestão Financeira
          </h1>
          <p className="text-gray-600 mt-1">Controle completo das finanças da plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wide">Receita Total</p>
                <p className="text-2xl font-bold mt-1">
                  R$ {(mockFinancialData.summary.totalRevenue / 1000).toFixed(0)}k
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{mockFinancialData.summary.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wide">Despesas Totais</p>
                <p className="text-2xl font-bold mt-1">
                  R$ {(mockFinancialData.summary.totalExpenses / 1000).toFixed(0)}k
                </p>
                <p className="text-xs opacity-75 mt-1">Inclui impostos</p>
              </div>
              <TrendingDown className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wide">Impostos</p>
                <p className="text-2xl font-bold mt-1">R$ {(mockFinancialData.summary.taxes / 1000).toFixed(0)}k</p>
                <p className="text-xs opacity-75 mt-1">10% da receita</p>
              </div>
              <FileText className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 ring-4 ring-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wide font-bold">LUCRO BRUTO</p>
                <p className="text-2xl font-bold mt-1">
                  R$ {(mockFinancialData.summary.grossProfit / 1000).toFixed(0)}k
                </p>
                <p className="text-xs opacity-75 mt-1">
                  {((mockFinancialData.summary.grossProfit / mockFinancialData.summary.totalRevenue) * 100).toFixed(1)}%
                  margem
                </p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wide">Lucro Líquido</p>
                <p className="text-2xl font-bold mt-1">R$ {(mockFinancialData.summary.netProfit / 1000).toFixed(0)}k</p>
                <p className="text-xs opacity-75 mt-1">
                  {((mockFinancialData.summary.netProfit / mockFinancialData.summary.totalRevenue) * 100).toFixed(1)}%
                  margem
                </p>
              </div>
              <Wallet className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="wallet">Carteira</TabsTrigger>
          <TabsTrigger value="postpaid">Clientes Pós-Pagos</TabsTrigger>
          <TabsTrigger value="reconciliation">Conciliação Bancária</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Receita por Fonte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.revenueBySource.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{source.source}</span>
                        <span className="text-sm font-bold text-gray-900">R$ {source.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{source.percentage.toFixed(1)}% do total</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Despesas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.expenses.map((expense, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                        <span className="text-sm font-bold text-gray-900">R$ {expense.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${expense.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{expense.percentage.toFixed(1)}% do total</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Saldo Total</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      R$ {(mockFinancialData.wallet.totalBalance / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Receitas Pendentes</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      R$ {(mockFinancialData.wallet.pendingRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-700 font-medium uppercase tracking-wide">Despesas Pendentes</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      R$ {(mockFinancialData.wallet.pendingExpenses / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <ArrowDownRight className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Saldo Disponível</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      R$ {(mockFinancialData.wallet.availableBalance / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extrato de Movimentações
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar transação..."
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="completed">Concluídas</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFinancialData.walletTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            }
                          >
                            {transaction.status === "completed" ? "Concluído" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-xl font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postpaid" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Clientes Pós-Pagos (Squad)</h3>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie limites de cheque especial e emissão de faturas mensais
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Cliente Squad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Cliente Pós-Pago</DialogTitle>
                  <DialogDescription>Configure o limite de cheque especial e condições de pagamento</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nome do Cliente</Label>
                    <Input id="client-name" placeholder="Ex: TechCorp Squad" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overdraft-limit">Limite de Cheque Especial</Label>
                    <Input id="overdraft-limit" type="number" placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-day">Dia de Emissão da Fatura</Label>
                    <Select defaultValue="31">
                      <SelectTrigger id="invoice-day">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Dia 1</SelectItem>
                        <SelectItem value="15">Dia 15</SelectItem>
                        <SelectItem value="31">Último dia do mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-days">Prazo de Pagamento (dias)</Label>
                    <Input id="payment-days" type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Adicionar Cliente</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockFinancialData.postPaidClients.map((client) => (
              <Card key={client.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        client.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      {client.status === "active" ? "Ativo" : "Pendente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Limite Cheque Especial</span>
                      <span className="font-semibold">R$ {client.overdraftLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Saldo Atual</span>
                      <span className="font-bold text-red-600">R$ {client.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${(Math.abs(client.currentBalance) / client.overdraftLimit) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {((Math.abs(client.currentBalance) / client.overdraftLimit) * 100).toFixed(1)}% do limite
                      utilizado
                    </p>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Emissão da Fatura</span>
                      <span className="font-medium">{new Date(client.invoiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Vencimento</span>
                      <span className="font-medium">{new Date(client.paymentDue).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Ver Fatura
                    </Button>
                    <Button size="sm" className="flex-1">
                      Editar Limite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Projeção de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFinancialData.postPaidClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{client.name}</h4>
                        <p className="text-sm text-gray-600">
                          Vencimento: {new Date(client.paymentDue).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        R$ {Math.abs(client.currentBalance).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Pagamento esperado</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Conciliação Bancária</h3>
              <p className="text-sm text-gray-600 mt-1">Identifique e reconcilie entradas bancárias</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Reconciliadas</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {mockFinancialData.bankReconciliation.filter((t) => t.status === "reconciled").length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-700 font-medium uppercase tracking-wide">Pendentes</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">
                      {mockFinancialData.bankReconciliation.filter((t) => t.status === "pending").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Total Movimentado</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      R${" "}
                      {(
                        mockFinancialData.bankReconciliation.reduce((sum, t) => sum + Math.abs(t.amount), 0) / 1000
                      ).toFixed(0)}
                      k
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Transações Bancárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFinancialData.bankReconciliation.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg transition-colors ${
                      transaction.status === "pending"
                        ? "border-orange-200 bg-orange-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                        {transaction.amount > 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.paymentMethod}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-xl font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}R$ {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      {transaction.status === "pending" ? (
                        <Button size="sm" className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Reconciliar
                        </Button>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Reconciliado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
