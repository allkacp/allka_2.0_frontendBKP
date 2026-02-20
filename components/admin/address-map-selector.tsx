"use client"

import { useState } from "react"
import { MapPin, Loader2, Navigation, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressMapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLat?: number
  initialLng?: number
}

export function AddressMapSelector({
  onLocationSelect,
  initialLat = -23.5505,
  initialLng = -46.6333,
}: AddressMapSelectorProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  )
  const [manualLat, setManualLat] = useState(initialLat.toString())
  const [manualLng, setManualLng] = useState(initialLng.toString())

  // Get current location using browser Geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setSelectedPosition({ lat, lng })
        setManualLat(lat.toFixed(6))
        setManualLng(lng.toFixed(6))

        // Reverse geocoding using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          )
          const data = await response.json()

          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          onLocationSelect(lat, lng, address)
        } catch (error) {
          console.error("[v0] Error fetching address:", error)
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error("[v0] Geolocation error:", error)
        alert("Não foi possível obter sua localização")
        setLoading(false)
      },
    )
  }

  // Handle manual coordinate input
  const handleManualSearch = async () => {
    const lat = Number.parseFloat(manualLat)
    const lng = Number.parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert("Por favor, insira coordenadas válidas")
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Coordenadas fora do intervalo válido")
      return
    }

    setLoading(true)
    setSelectedPosition({ lat, lng })

    // Reverse geocoding using Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      )
      const data = await response.json()

      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      onLocationSelect(lat, lng, address)
    } catch (error) {
      console.error("[v0] Error fetching address:", error)
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Selecionar Localização</span>
        </CardTitle>
        <CardDescription>Use sua localização atual ou insira coordenadas manualmente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Obtendo localização...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Usar Minha Localização Atual
            </>
          )}
        </Button>

        {/* Manual Coordinate Input */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-muted-foreground">OU</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-xs">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="-23.550520"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-xs">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="-46.633308"
                className="text-sm"
              />
            </div>
          </div>

          <Button onClick={handleManualSearch} disabled={loading} variant="outline" className="w-full bg-transparent">
            <Search className="mr-2 h-4 w-4" />
            Buscar Endereço
          </Button>
        </div>

        {/* Selected Position Display */}
        {selectedPosition && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Localização Selecionada</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Lat: {selectedPosition.lat.toFixed(6)}, Lng: {selectedPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OpenStreetMap Preview */}
        {selectedPosition && (
          <div className="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPosition.lng - 0.01},${selectedPosition.lat - 0.01},${selectedPosition.lng + 0.01},${selectedPosition.lat + 0.01}&layer=mapnik&marker=${selectedPosition.lat},${selectedPosition.lng}`}
              style={{ border: 0 }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
