'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ItemsPerPageSelectProps {
  value: string
  onValueChange: (value: string) => void
  variant?: 'top' | 'bottom'
}

export function ItemsPerPageSelect({ value, onValueChange, variant = 'top' }: ItemsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Itens:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-16 h-9 text-xs font-semibold text-white bg-blue-600 dark:bg-blue-600 border-0 hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors rounded-md px-2.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
