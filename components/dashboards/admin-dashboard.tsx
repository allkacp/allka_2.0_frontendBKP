
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Activity,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Lock,
  Key,
} from "lucide-react"

const adminStats = [
  {
    title: "Usuários Totais",
    value: "2,847",
    subtitle: "Usuários ativos",
    change: "+12% vs. mês anterior",
    icon: Users,
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    title: "Receita Total",
    value: "R$ 284k",
    subtitle: "Este mês",
    change: "+28% vs. mês anterior",
    icon: DollarSign,
    color: "bg-green-500",
    textColor: "text-white",
  },
  {
    title: "Projetos Ativos",
    value: "1,234",
    subtitle: "Em andamento",
    change: "+8% vs. semana anterior",
    icon: Activity,
    color: "bg-purple-500",
    textColor: "text-white",
  },
  {
    title: "Taxa de Sucesso",
    value: "94.2%",
    subtitle: "Projetos concluídos",
    change: "+2.1% vs. mês anterior",
    icon: CheckCircle,
    color: "bg-orange-500",
    textColor: "text-white",
  },
]

const usersByType = [
  { type: "Empresas", count: 847, percentage: 29.8, growth: "+15%", color: "bg-blue-100 text-blue-800" },
  { type: "Agências", count: 623, percentage: 21.9, growth: "+22%", color: "bg-green-100 text-green-800" },
  { type: "Nômades", count: 1247, percentage: 43.8, growth: "+8%", color: "bg-purple-100 text-purple-800" },
  { type: "Admins", count: 130, percentage: 4.5, growth: "+3%", color: "bg-orange-100 text-orange-800" },
]

const recentActivities = [
  { action: "Novo usuário cadastrado", user: "TechCorp Ltda", type: "Empresa", time: "2 min atrás", status: "success" },
  { action: "Projeto concluído", user: "Marketing Pro", type: "Agência", time: "15 min atrás", status: "success" },
  { action: "Pagamento processado", user: "João Silva", type: "Nômade", time: "32 min atrás", status: "success" },
  { action: "Disputa reportada", user: "StartupXYZ", type: "Empresa", time: "1h atrás", status: "warning" },
  { action: "Upgrade para Partner", user: "Creative Agency", type: "Agência", time: "2h atrás", status: "success" },
]

const systemAlerts = [
  { message: "Sistema de pagamentos funcionando normalmente", type: "success", time: "Agora" },
  { message: "Pico de tráfego detectado (+45%)", type: "info", time: "5 min atrás" },
  { message: "Backup automático concluído", type: "success", time: "1h atrás" },
  { message: "2 disputas pendentes de resolução", type: "warning", time: "3h atrás" },
]

const adminProfiles = [
  {
    name: "Master Admin",
    permissions: "Acesso Total",
    users: 1,
    color: "bg-red-100 text-red-800",
    description: "Controle completo da plataforma",
  },
  {
    name: "Gestão Financeira",
    permissions: "Financeiro",
    users: 3,
    color: "bg-green-100 text-green-800",
    description: "Relatórios, pagamentos e receitas",
  },
  {
    name: "Comercial",
    permissions: "Vendas & Marketing",
    users: 5,
    color: "bg-blue-100 text-blue-800",
    description: "Gestão de clientes e campanhas",
  },
  {
    name: "Gestão de Tarefas",
    permissions: "Operacional",
    users: 4,
    color: "bg-purple-100 text-purple-800",
    description: "Projetos, nômades e qualidade",
  },
]

const permissionMatrix = [
  { module: "Usuários", master: true, financeiro: false, comercial: true, operacional: false },
  { module: "Financeiro", master: true, financeiro: true, comercial: false, operacional: false },
  { module: "Projetos", master: true, financeiro: false, comercial: true, operacional: true },
  { module: "Relatórios", master: true, financeiro: true, comercial: true, operacional: true },
  { module: "Configurações", master: true, financeiro: false, comercial: false, operacional: false },
  { module: "Disputas", master: true, financeiro: false, comercial: false, operacional: true },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Centro de controle da plataforma Allka com gestão de permissões.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Shield className="h-4 w-4 mr-1" />
            Master Admin
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-4 w-4 mr-1" />
            Sistema Online
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className={`${stat.color} ${stat.textColor} border-0`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-90">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm opacity-75 mt-1">{stat.subtitle}</p>
                  <p className="text-xs opacity-75 mt-2">{stat.change}</p>
                </div>
                <div className="ml-4">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Profiles */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
            Perfis Administrativos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminProfiles.map((profile, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={profile.color}>{profile.name}</Badge>
                  <span className="text-sm font-semibold text-gray-600">
                    {profile.users} usuário{profile.users > 1 ? "s" : ""}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{profile.permissions}</h4>
                <p className="text-sm text-gray-600">{profile.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Gerenciar Permissões →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-orange-500" />
            Matrix de Permissões
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Módulo</th>
                  <th className="text-center py-3 px-4 font-semibold text-red-700">Master</th>
                  <th className="text-center py-3 px-4 font-semibold text-green-700">Financeiro</th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-700">Comercial</th>
                  <th className="text-center py-3 px-4 font-semibold text-purple-700">Operacional</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.module}</td>
                    <td className="text-center py-3 px-4">
                      {row.master ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.financeiro ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.comercial ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.operacional ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <Key className="h-4 w-4 inline mr-1" />
              <strong>Nota:</strong> Apenas o usuário Master pode criar e gerenciar outros perfis administrativos. O
              sistema de permissões será detalhado em uma tela específica de gerenciamento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Users by Type */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Distribuição de Usuários por Tipo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {usersByType.map((userType, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{userType.type}</h4>
                  <Badge className={userType.color}>{userType.growth}</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{userType.count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{userType.percentage}% do total</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${userType.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Alertas do Sistema
          </h3>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.type === "success"
                    ? "bg-green-50 border-green-200"
                    : alert.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      alert.type === "success"
                        ? "text-green-800"
                        : alert.type === "warning"
                          ? "text-orange-800"
                          : "text-blue-800"
                    }`}
                  >
                    {alert.message}
                  </p>
                  <span
                    className={`text-xs ${
                      alert.type === "success"
                        ? "text-green-600"
                        : alert.type === "warning"
                          ? "text-orange-600"
                          : "text-blue-600"
                    }`}
                  >
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.action}</h4>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge
                        className={
                          activity.status === "success"
                            ? "bg-green-500 text-white"
                            : activity.status === "warning"
                              ? "bg-orange-500 text-white"
                              : "bg-blue-500 text-white"
                        }
                      >
                        {activity.status === "success" ? "✓" : activity.status === "warning" ? "⚠" : "ℹ"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                Ferramentas de Gestão
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
                  <p className="font-medium text-red-800">Gerenciar Permissões</p>
                  <p className="text-sm text-red-600">Criar e editar perfis administrativos</p>
                </button>
                <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                  <p className="font-medium text-blue-800">Gerenciar Usuários</p>
                  <p className="text-sm text-blue-600">Criar, editar e desativar contas</p>
                </button>
                <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                  <p className="font-medium text-green-800">Relatórios Financeiros</p>
                  <p className="text-sm text-green-600">Visualizar receitas e pagamentos</p>
                </button>
                <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                  <p className="font-medium text-purple-800">Configurações da Plataforma</p>
                  <p className="text-sm text-purple-600">Ajustar parâmetros do sistema</p>
                </button>
                <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
                  <p className="font-medium text-orange-800">Resolver Disputas</p>
                  <p className="text-sm text-orange-600">Mediar conflitos entre usuários</p>
                </button>
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                  <p className="font-medium text-gray-800">Logs do Sistema</p>
                  <p className="text-sm text-gray-600">Monitorar atividades e erros</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
