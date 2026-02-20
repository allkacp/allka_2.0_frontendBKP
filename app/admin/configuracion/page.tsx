import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function AdminConfiguracionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Configuración del Sistema</h1>
        <p className="text-muted-foreground">Gestiona la configuración general de la plataforma</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>Ajustes básicos del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nombre del Sitio</Label>
              <Input id="site-name" defaultValue="Allka 2026" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Descripción</Label>
              <Input id="site-description" defaultValue="Plataforma de gestión de talento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email de Administrador</Label>
              <Input id="admin-email" type="email" defaultValue="admin@allka.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Configura las notificaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">Enviar notificaciones importantes por correo</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Seguridad</Label>
                <p className="text-sm text-muted-foreground">Notificar sobre eventos de seguridad</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reportes Semanales</Label>
                <p className="text-sm text-muted-foreground">Enviar resumen semanal de actividad</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>Configuración de seguridad del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticación de Dos Factores</Label>
                <p className="text-sm text-muted-foreground">Requerir 2FA para todos los usuarios</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sesiones Múltiples</Label>
                <p className="text-sm text-muted-foreground">Permitir múltiples sesiones activas</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancelar</Button>
          <Button>Guardar Cambios</Button>
        </div>
      </div>
    </div>
  )
}
