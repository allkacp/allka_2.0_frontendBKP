
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Edit, Key, UserCheck, UserX, Shield, Mail, Calendar } from "lucide-react"
import { UserManagementModal } from "@/components/admin/user-management-modal"
import { PasswordResetModal } from "@/components/admin/password-reset-modal"
import type { User } from "@/types/user"

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@techcorp.com",
    name: "Carlos Silva",
    account_type: "empresas",
    account_sub_type: "in-house",
    company_id: 1,
    role: "company_admin",
    permissions: [],
    is_admin: true,
    is_active: true,
    created_at: "2023-06-15",
    updated_at: "2024-01-20",
  },
  {
    id: 2,
    email: "nomade@allka.com",
    name: "Ana Santos",
    account_type: "nomades",
    account_sub_type: null,
    role: "nomad",
    permissions: [],
    is_admin: false,
    is_active: true,
    created_at: "2023-07-01",
    updated_at: "2024-01-15",
  },
  {
    id: 3,
    email: "agency@partner.com",
    name: "João Costa",
    account_type: "agencias",
    account_sub_type: null,
    agency_id: 1,
    role: "agency_admin",
    permissions: [],
    is_admin: false,
    is_active: false,
    created_at: "2023-08-10",
    updated_at: "2024-01-10",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((user) => user.account_type === filterType)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterType])

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user)

    switch (action) {
      case "edit":
        setShowUserModal(true)
        break
      case "password":
        setShowPasswordModal(true)
        break
      case "toggle_status":
        // Toggle user active status
        const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
        setUsers(updatedUsers)
        break
    }
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "empresas":
        return "Empresa"
      case "agencias":
        return "Agência"
      case "nomades":
        return "Nômade"
      case "admin":
        return "Admin"
      default:
        return type
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "company_admin":
        return "Admin Empresa"
      case "company_user":
        return "Usuário Empresa"
      case "agency_admin":
        return "Admin Agência"
      case "agency_user":
        return "Usuário Agência"
      case "nomad":
        return "Nômade"
      case "admin":
        return "Administrador"
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-6 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredUsers.length} usuários
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Todos os tipos</option>
                <option value="empresas">Empresas</option>
                <option value="agencias">Agências</option>
                <option value="nomades">Nômades</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.name}</h3>
                      {user.is_admin && <Shield className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Criado em {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getAccountTypeLabel(user.account_type)}</Badge>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{getRoleLabel(user.role)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleUserAction(user, "edit")}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleUserAction(user, "password")}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={user.is_active ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleUserAction(user, "toggle_status")}
                    >
                      {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UserManagementModal
            user={selectedUser}
            open={showUserModal}
            onOpenChange={setShowUserModal}
            onSave={(updatedUser) => {
              const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
              setUsers(updatedUsers)
              setShowUserModal(false)
            }}
          />

          <PasswordResetModal
            user={selectedUser}
            open={showPasswordModal}
            onOpenChange={setShowPasswordModal}
            onReset={() => {
              setShowPasswordModal(false)
              // Handle password reset logic
            }}
          />
        </>
      )}
    </div>
  )
}
