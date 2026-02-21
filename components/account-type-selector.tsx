
import { Button } from "@/components/ui/button"
import { ChevronRight, Building2, Users, UserCheck, Shield } from "lucide-react"
import { useAccountType, type AccountType, type AccountSubType } from "@/contexts/account-type-context"
import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

const accountTypes = [
  {
    type: "empresas" as AccountType,
    label: "Empresas",
    icon: Building2,
    subTypes: [
      { subType: "company" as AccountSubType, label: "Company" },
      { subType: "in-house" as AccountSubType, label: "In-House" },
    ],
  },
  {
    type: "agencias" as AccountType,
    label: "Agências",
    icon: Users,
    subTypes: [],
  },
  {
    type: "nomades" as AccountType,
    label: "Nômades",
    icon: UserCheck,
    subTypes: [],
  },
  {
    type: "admin" as AccountType,
    label: "Admin",
    icon: Shield,
    subTypes: [],
  },
]

export function AccountTypeSelector() {
  const { accountType, accountSubType, setAccountType } = useAccountType()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        console.log("[v0] Closing dropdown - clicked outside")
        setIsOpen(false)
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 100)

      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const dropdownWidth = 650 // Approximate width for horizontal layout
        const dropdownHeight = 100 // Approximate height for horizontal layout
        const spacing = 12 // Space between button and dropdown

        // Calculate horizontal position (default: to the right)
        let left = rect.right + spacing

        // Check if dropdown would overflow right edge
        if (left + dropdownWidth > viewportWidth - spacing) {
          // Try positioning to the left of the button
          left = rect.left - dropdownWidth - spacing

          // If still overflows (button too far left), align with right edge of viewport
          if (left < spacing) {
            left = viewportWidth - dropdownWidth - spacing
          }
        }

        // Calculate vertical position (align with button center)
        let top = rect.top + rect.height / 2 - dropdownHeight / 2

        // Ensure dropdown doesn't overflow bottom
        if (top + dropdownHeight > viewportHeight - spacing) {
          top = viewportHeight - dropdownHeight - spacing
        }

        // Ensure dropdown doesn't overflow top
        if (top < spacing) {
          top = spacing
        }

        console.log("[v0] Dropdown position calculated:", {
          buttonRect: {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          },
          viewport: { width: viewportWidth, height: viewportHeight },
          calculated: { top, left },
          dropdownSize: { width: dropdownWidth, height: dropdownHeight },
        })

        setDropdownPosition({ top, left })
      }
    }

    if (isOpen) {
      requestAnimationFrame(updatePosition)

      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition, true)

      return () => {
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition, true)
      }
    }
  }, [isOpen])

  const currentAccount = accountTypes.find((acc) => acc.type === accountType)
  const currentSubType = currentAccount?.subTypes.find((sub) => sub.subType === accountSubType)

  const getDisplayLabel = () => {
    if (currentSubType) {
      return `${currentAccount?.label} - ${currentSubType.label}`
    }
    return currentAccount?.label || "Selecionar Conta"
  }

  const handleAccountTypeSelect = (type: AccountType, subType?: AccountSubType) => {
    console.log("[v0] Account type selected:", type, subType)
    setAccountType(type, subType)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    console.log("[v0] Dropdown toggle clicked, current state:", isOpen)
    setIsOpen((prev) => !prev)
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-full flex items-center justify-between space-x-2 bg-slate-800 text-white border-slate-600"
        disabled
      >
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span className="truncate">Carregando...</span>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
      </Button>
    )
  }

  return (
    <>
      <div className="relative w-full">
        <Button
          ref={buttonRef}
          variant="outline"
          className="w-full flex items-center justify-between space-x-2 bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:border-slate-500"
          onClick={toggleDropdown}
          type="button"
        >
          <div className="flex items-center space-x-2">
            {currentAccount && <currentAccount.icon className="h-4 w-4" />}
            <span className="truncate">{getDisplayLabel()}</span>
          </div>
          <ChevronRight
            className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-slate-800 border border-slate-600 rounded-md shadow-2xl overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999999,
            }}
          >
            <div className="flex flex-row items-stretch min-h-[80px]">
              <div className="px-4 py-3 text-sm font-medium text-slate-200 border-r border-slate-600 flex items-center whitespace-nowrap bg-slate-750 min-w-[140px]">
                Tipos de Conta
              </div>
              <div className="flex flex-row items-stretch divide-x divide-slate-600">
                {accountTypes.map((account) => (
                  <div key={account.type} className="flex flex-col min-w-[120px]">
                    {account.subTypes.length > 0 ? (
                      <>
                        <div className="px-4 py-2 text-xs text-slate-400 font-medium bg-slate-750 border-b border-slate-600">
                          {account.label}
                        </div>
                        <div className="flex flex-col flex-1">
                          {account.subTypes.map((subType) => (
                            <button
                              key={`${account.type}-${subType.subType}`}
                              onClick={() => handleAccountTypeSelect(account.type, subType.subType)}
                              className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2 transition-colors duration-150 whitespace-nowrap flex-1"
                              type="button"
                            >
                              <account.icon className="h-4 w-4" />
                              <span>{subType.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAccountTypeSelect(account.type)}
                        className="px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2 transition-colors duration-150 whitespace-nowrap h-full"
                        type="button"
                      >
                        <account.icon className="h-4 w-4" />
                        <span>{account.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
