"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface ConfirmationDialogProps {
  /** Controls the visibility of the dialog */
  open: boolean
  /** Function called when the dialog is closed (Cancel button or outside click) */
  onClose: () => void
  /** Function called when the user confirms the action */
  onConfirm: () => void
  /** Title text for the dialog */
  title: string
  /** Main message explaining the action to be confirmed */
  message: string
  /** Text for the confirm button (default: "Confirmar") */
  confirmText?: string
  /** Text for the cancel button (default: "Cancelar") */
  cancelText?: string
  /** Whether the confirm button should have destructive styling (default: true) */
  destructive?: boolean
}

/**
 * Generic confirmation dialog component for destructive actions
 *
 * @example
 * \`\`\`tsx
 * const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null })
 *
 * const handleDeleteClick = (item) => {
 *   setDeleteDialog({ open: true, item })
 * }
 *
 * const handleConfirmDelete = async () => {
 *   await deleteItem(deleteDialog.item.id)
 *   setDeleteDialog({ open: false, item: null })
 * }
 *
 * <ConfirmationDialog
 *   open={deleteDialog.open}
 *   onClose={() => setDeleteDialog({ open: false, item: null })}
 *   onConfirm={handleConfirmDelete}
 *   title="Confirmar Exclusão"
 *   message={`Tem certeza que deseja excluir "${deleteDialog.item?.name}"? Esta ação não pode ser desfeita.`}
 * />
 * \`\`\`
 */
export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  destructive = true,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="gap-3">
          <div className="flex items-center gap-3">
            {destructive ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <AlertDialogTitle className="text-left text-xl">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left text-base leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="sm:flex-1"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              destructive 
                ? "bg-destructive text-white hover:bg-destructive/90 font-semibold sm:flex-1" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold sm:flex-1"
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
