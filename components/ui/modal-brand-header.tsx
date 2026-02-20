import { ReactNode } from "react"

interface ModalBrandHeaderProps {
  title: string
  left?: ReactNode
  right?: ReactNode
}

export function ModalBrandHeader({ title, left, right }: ModalBrandHeaderProps) {
  return (
    <div className="app-brand-header flex items-center justify-between px-6 py-4 gap-4">
      {/* Left section - Avatar or custom content */}
      {left && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {left}
        </div>
      )}

      {/* Center section - Title */}
      <h2 className="text-white text-lg font-semibold flex-1 min-w-0">
        {title}
      </h2>

      {/* Right section - Actions and close button */}
      {right && (
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          {right}
        </div>
      )}
    </div>
  )
}
