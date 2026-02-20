"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { Users, Target, CheckCircle, AlertCircle } from "lucide-react"

const mockAvailability = {
  categories: [
    {
      id: 1,
      name: "Design Gráfico",
      totalNomades: 25,
      availableNomades: 18,
      activeTasks: 45,
      pendingTasks: 12,
      avgResponseTime: "2.5h",
      utilizationRate: 72,
    },
    {
      id: 2,
      name: "Copywriting",
      totalNomades: 15,
      availableNomades: 12,
      activeTasks: 28,
      pendingTasks: 8,
      avgResponseTime: "1.8h",
      utilizationRate: 80,
    },
    {
      id: 3,
      name: "Desenvolvimento Web",
      totalNomades: 18,
      availableNomades: 8,
      activeTasks: 52,
      pendingTasks: 15,
      avgResponseTime: "4.2h",
      utilizationRate: 89,
    },
    {
      id: 4,
      name: "Social Media",
      totalNomades: 30,
      availableNomades: 22,
      activeTasks: 38,
      pendingTasks: 6,
      avgResponseTime: "1.5h",
      utilizationRate: 63,
    },
  ],
  weeklySchedule: [
    { day: "Segunda", available: 45, busy: 15, total: 60 },
    { day: "Terça", available: 42, busy: 18, total: 60 },
    { day: "Quarta", available: 48, busy: 12, total: 60 },
    { day: "Quinta", available: 40, busy: 20, total: 60 },
    { day: "Sexta", available: 38, busy: 22, total: 60 },
    { day: "Sábado", available: 25, busy: 10, total: 35 },
    { day: "Domingo", available: 15, busy: 5, total: 20 },
  ],
}

export default function AdminDisponibilidadePage() {
  const totalAvailable = mockAvailability.categories.reduce((sum, cat) => sum + cat.availableNomades, 0)
  const totalNomades = mockAvailability.categories.reduce((sum, cat) => sum + cat.totalNomades, 0)
  const totalActiveTasks = mockAvailability.categories.reduce((sum, cat) => sum + cat.activeTasks, 0)
  const totalPendingTasks = mockAvailability.categories.reduce((sum, cat) => sum + cat.pendingTasks, 0)

  return (
    <div className="container mx-auto space-y-6 bg-slate-200 py-0 px-0">
      <PageHeader
        title="Disponibilidade"
        description="Gerencie a disponibilidade dos nômades e acompanhe a capacidade por categoria"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nômades Disponíveis</p>
                <p className="text-3xl font-bold mt-2">{totalAvailable}</p>
                <p className="text-xs opacity-75 mt-1">de {totalNomades} total</p>
              </div>
              <CheckCircle className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tarefas Ativas</p>
                <p className="text-3xl font-bold mt-2">{totalActiveTasks}</p>
              </div>
              <Target className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tarefas Pendentes</p>
                <p className="text-3xl font-bold mt-2">{totalPendingTasks}</p>
              </div>
              <AlertCircle className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taxa de Utilização</p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round(((totalNomades - totalAvailable) / totalNomades) * 100)}%
                </p>
              </div>
              <Users className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="schedule">Agenda Semanal</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {mockAvailability.categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{category.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      category.utilizationRate > 80
                        ? "bg-red-50 text-red-700 border-red-200"
                        : category.utilizationRate > 60
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {category.utilizationRate}% utilização
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Disponíveis</p>
                    <p className="text-2xl font-bold text-green-600">{category.availableNomades}</p>
                    <p className="text-xs text-gray-500">de {category.totalNomades}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tarefas Ativas</p>
                    <p className="text-2xl font-bold text-blue-600">{category.activeTasks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-orange-600">{category.pendingTasks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo Resposta</p>
                    <p className="text-2xl font-bold">{category.avgResponseTime}</p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Capacidade</span>
                    <span className="font-medium">{category.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        category.utilizationRate > 80
                          ? "bg-red-500"
                          : category.utilizationRate > 60
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${category.utilizationRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAvailability.weeklySchedule.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-sm text-gray-600">
                        {day.available} disponíveis / {day.total} total
                      </span>
                    </div>
                    <div className="flex gap-1 h-8">
                      <div
                        className="bg-green-500 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.available / day.total) * 100}%` }}
                      >
                        {day.available > 10 && `${day.available}`}
                      </div>
                      <div
                        className="bg-red-500 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.busy / day.total) * 100}%` }}
                      >
                        {day.busy > 5 && `${day.busy}`}
                      </div>
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
