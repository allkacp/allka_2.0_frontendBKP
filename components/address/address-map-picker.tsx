"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface AddressData {
  street: string
  number: string
  district: string
  city: string
  state: string
  zipcode: string
  lat: number
  lng: number
  placeId: string
  formatted: string
}

interface AddressMapPickerProps {
  address?: Partial<AddressData>
  onAddressChange?: (address: Partial<AddressData>) => void
}

export function AddressMapPicker({ address, onAddressChange }: AddressMapPickerProps) {
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [googleMapsReady, setGoogleMapsReady] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    address?.lat && address?.lng ? { lat: address.lat, lng: address.lng } : null,
  )
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)

  // Check if Google Maps API is available
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof (window as any).google !== "undefined" && (window as any).google.maps) {
        setGoogleMapsReady(true)
      }
    }

    // Check immediately
    checkGoogleMaps()

    // Also check periodically in case API loads later
    const interval = setInterval(checkGoogleMaps, 500)
    return () => clearInterval(interval)
  }, [])

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (!googleMapsReady) return
    if (typeof (window as any).google === "undefined") return

    if (searchInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          componentRestrictions: { country: "br" },
          types: ["address"],
        },
      )

      autocompleteRef.current.addListener("place_changed", handlePlaceSelect)
    }
  }, [googleMapsReady])

  // Initialize map
  useEffect(() => {
    if (!googleMapsReady || typeof (window as any).google === "undefined" || !mapRef.current || mapLoaded) return

    const initialLat = selectedPosition?.lat || -23.5505
    const initialLng = selectedPosition?.lng || -46.6333

    const map = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: initialLat, lng: initialLng },
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    })

    mapInstanceRef.current = map

    // Add marker
    const marker = new (window as any).google.maps.Marker({
      position: { lat: initialLat, lng: initialLng },
      map,
      draggable: true,
    })

    markerRef.current = marker

    // Handle marker drag
    marker.addListener("dragend", async () => {
      const position = marker.getPosition()
      const lat = position.lat()
      const lng = position.lng()

      setSelectedPosition({ lat, lng })
      geocodeLatLng(lat, lng)
    })

    setMapLoaded(true)

    return () => {
      mapInstanceRef.current = null
    }
  }, [mapLoaded])

  // Update marker position when selectedPosition changes
  useEffect(() => {
    if (markerRef.current && selectedPosition) {
      markerRef.current.setPosition(selectedPosition)
      mapInstanceRef.current?.setCenter(selectedPosition)
    }
  }, [selectedPosition])

  const handlePlaceSelect = async () => {
    if (!autocompleteRef.current) return

    const place = autocompleteRef.current.getPlace()

    if (!place.geometry) {
      console.error("[v0] No geometry found for place")
      return
    }

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    setSelectedPosition({ lat, lng })
    setSearchInput(place.formatted_address || "")

    // Parse address components
    const addressData = parseAddressComponents(place)
    addressData.lat = lat
    addressData.lng = lng
    addressData.placeId = place.place_id || ""
    addressData.formatted = place.formatted_address || ""

    onAddressChange?.(addressData)
    setSuggestions([])
  }

  const geocodeLatLng = async (lat: number, lng: number) => {
    try {
      const geocoder = new (window as any).google.maps.Geocoder()

      geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const place = results[0]
          setSearchInput(place.formatted_address || "")

          const addressData = parseAddressComponents(place)
          addressData.lat = lat
          addressData.lng = lng
          addressData.placeId = place.place_id || ""
          addressData.formatted = place.formatted_address || ""

          onAddressChange?.(addressData)
        }
      })
    } catch (error) {
      console.error("[v0] Geocoding error:", error)
    }
  }

  const parseAddressComponents = (place: any): Partial<AddressData> => {
    const components: any = {}

    if (place.address_components) {
      place.address_components.forEach((component: any) => {
        const types = component.types

        if (types.includes("route")) components.street = component.long_name
        if (types.includes("street_number")) components.number = component.long_name
        if (types.includes("sublocality") || types.includes("administrative_area_level_2"))
          components.district = component.long_name
        if (types.includes("administrative_area_level_1")) components.state = component.short_name
        if (types.includes("locality")) components.city = component.long_name
        if (types.includes("postal_code")) components.zipcode = component.long_name
      })
    }

    return {
      street: components.street || "",
      number: components.number || "",
      district: components.district || "",
      city: components.city || "",
      state: components.state || "",
      zipcode: components.zipcode || "",
    }
  }

  return (
    <div className="space-y-4">
      {!googleMapsReady && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-900">Google Maps não foi configurado</p>
              <p className="text-xs text-yellow-800 mt-1">Solicite ao administrador para configurar a API Key do Google Maps para usar o seletor de localização.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="address-search">Endereço {googleMapsReady ? "(com mapa)" : "(manual)"}</Label>
        <Input
          ref={searchInputRef}
          id="address-search"
          type="text"
          placeholder={googleMapsReady ? "Digite um endereço..." : "Digite manualmente"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />
        {googleMapsReady && <p className="text-xs text-muted-foreground">Comece digitando para ver sugestões</p>}
      </div>

      {googleMapsReady && selectedPosition && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium">Localização selecionada</p>
                <p className="text-xs text-muted-foreground">Lat: {selectedPosition.lat.toFixed(6)}</p>
                <p className="text-xs text-muted-foreground">Lng: {selectedPosition.lng.toFixed(6)}</p>
              </div>
            </div>

            {/* Google Map iframe for preview */}
            <div
              ref={mapRef}
              className="w-full h-64 rounded-lg border border-gray-200 bg-gray-100"
              style={{ minHeight: "300px" }}
            />

            <p className="text-xs text-muted-foreground text-center">Arraste o marcador para ajustar a localização</p>
          </div>
        </Card>
      )}

      {googleMapsReady && !mapLoaded && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          Carregando mapa...
        </div>
      )}
    </div>
  )
}
