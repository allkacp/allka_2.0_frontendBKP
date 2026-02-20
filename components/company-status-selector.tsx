"use client"

import { CheckCircle, Pause, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type CompanyStatus = "active" | "inactive" | "pending"

interface CompanyStatusSelectorProps {
  value: CompanyStatus
  onChange: (status: CompanyStatus) => void
  disabled?: boolean
  showLabel?: boolean
}

const statusConfig = {
  active: {
    label: "Ativa",
    icon: CheckCircle,
    classes: "bg-emerald-500 text-white shadow-md scale-105",
    hoverClasses: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
  inactive: {
    label: "Inativa",
    icon: Pause,
    classes: "bg-gray-500 text-white shadow-md scale-105",
    hoverClasses: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    classes: "bg-amber-500 text-white shadow-md scale-105",
    hoverClasses: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
}

export function CompanyStatusSelector({
  value,
  onChange,
  disabled = false,
  showLabel = true,
}: CompanyStatusSelectorProps) {
  const statusOptions: (keyof typeof statusConfig)[] = ["active", "inactive", "pending"]

  return (
    <div className="space-y-2">
      {showLabel && (
        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Situação da Empresa</h3>
          <p className="text-xs text-blue-700">Defina o status da empresa</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        {statusOptions.map((status) => {
          const config = statusConfig[status]
          const Icon = config.icon
          const isSelected = value === status
          
          return (
            <button
              key={status}
              onClick={() => onChange(status)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                isSelected ? config.classes : config.hoverClasses,
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}


