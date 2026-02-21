
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Clock, Eye, Download, FileText, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Term {
  id: number
  name: string
  version: string
  publishedAt: string
  signedAt?: string
  expiresAt?: string
  content: string
  status: "active" | "pending" | "expired"
}

interface TermsManagementTabProps {
  company: any
}

// Mock data de termos
const MOCK_TERMS: Term[] = [
  {
    id: 1,
    name: "Termos de Serviço",
    version: "v2.1",
    publishedAt: "2024-01-15",
    signedAt: "2024-01-20",
    expiresAt: "2025-01-20",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "active",
  },
  {
    id: 2,
    name: "Política de Privacidade",
    version: "v3.0",
    publishedAt: "2024-02-01",
    signedAt: "2024-02-05",
    expiresAt: "2025-02-05",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "active",
  },
  {
    id: 3,
    name: "Política de Conformidade LGPD",
    version: "v2.0",
    publishedAt: "2024-03-01",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "pending",
  },
  {
    id: 4,
    name: "Código de Conduta",
    version: "v1.5",
    publishedAt: "2024-03-10",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "pending",
  },
  {
    id: 5,
    name: "Termo Antigo de Serviço",
    version: "v1.0",
    publishedAt: "2023-01-01",
    signedAt: "2023-01-10",
    expiresAt: "2024-01-10",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "expired",
  },
]

export function TermsManagementTab({ company }: TermsManagementTabProps) {
  const { toast } = useToast()
  const [terms, setTerms] = useState<Term[]>(MOCK_TERMS)
  const [showTermModal, setShowTermModal] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)
  const [showSignConfirm, setShowSignConfirm] = useState(false)
  const [termToSign, setTermToSign] = useState<Term | null>(null)

  const activeTerms = terms.filter(t => t.status === "active")
  const pendingTerms = terms.filter(t => t.status === "pending")
  const expiredTerms = terms.filter(t => t.status === "expired")

  const handleViewTerm = (term: Term) => {
    setSelectedTerm(term)
    setShowTermModal(true)
  }

  const handleSignTerm = (term: Term) => {
    setTermToSign(term)
    setShowSignConfirm(true)
  }

  const confirmSignTerm = () => {
    if (!termToSign) return

    setTerms(prevTerms =>
      prevTerms.map(t => {
        if (t.id === termToSign.id) {
          return {
            ...t,
            status: "active",
            signedAt: new Date().toISOString().split("T")[0],
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          }
        }
        return t
      })
    )

    toast({
      title: "Sucesso!",
      description: `${termToSign.name} foi assinado com sucesso.`,
    })

    setShowSignConfirm(false)
    setTermToSign(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const TermCard = ({ term }: { term: Term }) => (
    <Card className="p-4 border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 className="font-semibold text-slate-900">{term.name}</h3>
            <Badge variant="outline" className="text-xs">
              {term.version}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            {term.signedAt && (
              <p>
                <span className="font-medium">Assinado em:</span> {formatDate(term.signedAt)}
              </p>
            )}
            {term.expiresAt && (
              <p>
                <span className="font-medium">Válido até:</span> {formatDate(term.expiresAt)}
              </p>
            )}
            {term.publishedAt && !term.signedAt && (
              <p>
                <span className="font-medium">Publicado em:</span> {formatDate(term.publishedAt)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 gap-1"
            onClick={() => handleViewTerm(term)}
          >
            <Eye className="h-3.5 w-3.5" />
            Visualizar
          </Button>
          {term.status === "pending" && (
            <Button
              size="sm"
              className="text-xs h-8 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleSignTerm(term)}
            >
              Assinar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1: TERMOS ATIVOS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Termos Ativos</h2>
          <Badge className="bg-emerald-100 text-emerald-800">{activeTerms.length}</Badge>
        </div>
        {activeTerms.length > 0 ? (
          <div className="space-y-3">
            {activeTerms.map(term => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        ) : (
          <Card className="p-6 bg-slate-50 border-dashed border-slate-300 text-center">
            <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Nenhum termo ativo</p>
          </Card>
        )}
      </div>

      {/* SEÇÃO 2: TERMOS PENDENTES DE ASSINATURA */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">Termos Pendentes</h2>
          <Badge className="bg-amber-100 text-amber-800">{pendingTerms.length}</Badge>
        </div>
        {pendingTerms.length > 0 ? (
          <div className="space-y-3">
            {pendingTerms.map(term => (
              <Card key={term.id} className="p-4 border-2 border-amber-200 bg-amber-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h3 className="font-semibold text-slate-900">{term.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {term.version}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>
                        <span className="font-medium">Publicado em:</span> {formatDate(term.publishedAt)}
                      </p>
                      <p className="text-amber-700 font-medium">
                        ⚠️ Obrigatório para continuar usando a plataforma
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1"
                      onClick={() => handleViewTerm(term)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Visualizar
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs h-8 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSignTerm(term)}
                    >
                      Assinar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 bg-slate-50 border-dashed border-slate-300 text-center">
            <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Nenhum termo pendente</p>
          </Card>
        )}
      </div>

      {/* SEÇÃO 3: TERMOS EXPIRADOS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Termos Expirados</h2>
          <Badge variant="outline" className="text-slate-600">
            {expiredTerms.length}
          </Badge>
        </div>
        {expiredTerms.length > 0 ? (
          <div className="space-y-3">
            {expiredTerms.map(term => (
              <Card key={term.id} className="p-4 border border-slate-200 opacity-75">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <h3 className="font-semibold text-slate-700 line-through">{term.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {term.version}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>
                        <span className="font-medium">Período de validade:</span> {formatDate(term.publishedAt)} -{" "}
                        {formatDate(term.expiresAt || "")}
                      </p>
                      <p className="text-slate-500 italic">Status: Expirado</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1"
                    onClick={() => handleViewTerm(term)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 bg-slate-50 border-dashed border-slate-300 text-center">
            <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Nenhum termo expirado</p>
          </Card>
        )}
      </div>

      {/* Modal: Visualizar Termo */}
      {showTermModal && selectedTerm && (
        <Dialog open={showTermModal} onOpenChange={setShowTermModal}>
          <DialogContent className="max-w-2xl max-h-96">
            <DialogHeader>
              <DialogTitle>{selectedTerm.name}</DialogTitle>
              <DialogDescription>
                Versão {selectedTerm.version} • Publicado em {formatDate(selectedTerm.publishedAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed">
              {selectedTerm.content}
            </div>
            {selectedTerm.signedAt && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800">
                ✓ Assinado em {formatDate(selectedTerm.signedAt)}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTermModal(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Confirmar Assinatura */}
      {showSignConfirm && termToSign && (
        <Dialog open={showSignConfirm} onOpenChange={setShowSignConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Assinatura</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Ao assinar, a empresa <strong>{company.name}</strong> concorda com os termos e condições do documento:
                </p>
                <p className="font-semibold text-blue-900 mt-2">{termToSign.name}</p>
              </div>
              <p className="text-xs text-slate-500">
                Esta ação será registrada para auditoria e não poderá ser desfeita.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSignConfirm(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={confirmSignTerm}
              >
                Confirmar Assinatura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
