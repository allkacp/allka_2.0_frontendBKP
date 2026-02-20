"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSpecialties, type Specialty } from "./specialty-context"
import { usePricing } from "./pricing-context"

export interface Step {
  id: string
  name: string
  description: string
  order: number
  estimatedHours: number
  specialtyId: number | null
  experienceLevel: "iniciante" | "junior" | "pleno" | "senior" | null
  calculatedCost: number // Automatic: hours × hourly rate
}

export interface Questionnaire {
  id: string
  title: string
  description: string
  questions: {
    id: string
    question: string
    type: "text" | "multiline" | "select" | "multiselect" | "file"
    required: boolean
    options?: string[]
    aiAssisted: boolean
  }[]
}

export interface Task {
  id: string
  name: string
  description: string
  dependencies: string[]
  canRunInParallel: boolean
  steps: Step[]
  questionnaire: Questionnaire | null
  calculatedCost: number // Sum of all steps
}

export interface ProductVariation {
  id: string
  label: string // Ex: "1 Criativo + 1 Copy", "2 Criativos + 2 Copys"
  quantity: number
  priceModifier: number // Additional price or discount
}

export interface ProductAddOn {
  id: string
  name: string // Ex: "Carrossel", "Motion", "Entrega Expressa"
  price: number
  category: "creative_type" | "extra" // Category to group add-ons
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  tasks: Task[]
  createdAt: string
  updatedAt: string
  isActive: boolean
  totalTasksCost: number
  qualificationFee: number
  subtotal: number
  taxes: number
  operationalFee: number
  partnerCommission: number
  finalPrice: number
  variations: ProductVariation[]
  addOns: ProductAddOn[]
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Product) => void
  deleteProduct: (id: string) => void
  calculateStepCost: (hours: number, specialtyId: number, level: keyof Specialty["rates"]) => number
  calculateTaskCost: (task: Task) => number
  calculateProductPricing: (product: Product) => Product
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const { specialties } = useSpecialties()
  const { pricingComponents } = usePricing()
  
  const [products, setProducts] = useState<Product[]>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("allka-products")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // If there are stored products, use them
          if (parsed && parsed.length > 0) {
            return parsed
          }
        } catch (e) {
          console.error("Error parsing stored products:", e)
        }
      }
    }
    
    // If no stored products, return demo products
    return [
      {
        id: "demo-1",
        name: "Design de Posts para Instagram",
        description: "Pacote completo de design para posts de Instagram com criação de artes estáticas e copies impactantes. Ideal para gestão eficaz de redes sociais e engajamento do público.",
        category: "Design e Audiovisual",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        variations: [
          { id: "v1", label: "1 Criativo + 1 Copy", quantity: 1, priceModifier: 0 },
          { id: "v2", label: "2 Criativos + 2 Copys", quantity: 2, priceModifier: 235.87 },
          { id: "v3", label: "4 Criativos + 4 Copys", quantity: 4, priceModifier: 471.74 },
          { id: "v4", label: "8 Criativos + 8 Copys", quantity: 8, priceModifier: 943.48 },
        ],
        addOns: [
          { id: "a1", name: "Arte Estática", price: 0, category: "creative_type" },
          { id: "a2", name: "Carrossel", price: 50.0, category: "creative_type" },
          { id: "a3", name: "Motion", price: 100.0, category: "creative_type" },
          { id: "a4", name: "Entrega Expressa (24h)", price: 75.5, category: "extra" },
          { id: "a5", name: "Arquivos Fonte", price: 45.0, category: "extra" },
          { id: "a6", name: "Revisões Ilimitadas", price: 60.0, category: "extra" },
        ],
        tasks: [
          {
            id: "t1",
            name: "Briefing e Pesquisa",
            description: "Coleta de informações do cliente e pesquisa de referências visuais",
            dependencies: [],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: {
              id: "q1",
              title: "Briefing Criativo",
              description: "Informações necessárias para iniciar o projeto",
              questions: [
                {
                  id: "q1-1",
                  question: "Qual é o objetivo principal deste post?",
                  type: "multiline",
                  required: true,
                  aiAssisted: false,
                },
                {
                  id: "q1-2",
                  question: "Quem é o público-alvo?",
                  type: "multiline",
                  required: true,
                  aiAssisted: true,
                },
                {
                  id: "q1-3",
                  question: "Possui manual de marca ou guia de estilo?",
                  type: "file",
                  required: false,
                  aiAssisted: false,
                },
              ],
            },
            steps: [
              {
                id: "s1",
                name: "Análise do Briefing",
                description: "Revisar informações fornecidas pelo cliente",
                order: 1,
                estimatedHours: 2,
                specialtyId: 1,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
              {
                id: "s2",
                name: "Pesquisa de Referências",
                description: "Buscar inspirações visuais e tendências",
                order: 2,
                estimatedHours: 3,
                specialtyId: 1,
                experienceLevel: "junior",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t2",
            name: "Criação do Design",
            description: "Desenvolvimento das artes visuais do post",
            dependencies: ["t1"],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: null,
            steps: [
              {
                id: "s3",
                name: "Conceito Visual",
                description: "Definir paleta de cores, tipografia e estilo",
                order: 1,
                estimatedHours: 4,
                specialtyId: 1,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
              {
                id: "s4",
                name: "Criação da Arte",
                description: "Produzir as artes finais no formato Instagram",
                order: 2,
                estimatedHours: 6,
                specialtyId: 1,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t3",
            name: "Copywriting",
            description: "Criação de textos persuasivos para os posts",
            dependencies: ["t1"],
            canRunInParallel: true,
            calculatedCost: 0,
            questionnaire: null,
            steps: [
              {
                id: "s5",
                name: "Desenvolvimento de Copy",
                description: "Escrever legendas e CTAs impactantes",
                order: 1,
                estimatedHours: 4,
                specialtyId: 2,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t4",
            name: "Revisão e Aprovação",
            description: "Ajustes finais e validação com o cliente",
            dependencies: ["t2", "t3"],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: {
              id: "q2",
              title: "Revisão e Confirmação",
              description: "Itens para verificação final",
              questions: [
                {
                  id: "q2-1",
                  question: "Quais ajustes são necessários?",
                  type: "multiline",
                  required: false,
                  aiAssisted: false,
                },
              ],
            },
            steps: [
              {
                id: "s6",
                name: "Revisão Técnica",
                description: "Verificar qualidade e formatos",
                order: 1,
                estimatedHours: 2,
                specialtyId: 1,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
              {
                id: "s7",
                name: "Ajustes Solicitados",
                description: "Implementar feedback do cliente",
                order: 2,
                estimatedHours: 3,
                specialtyId: 1,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
            ],
          },
        ],
        totalTasksCost: 0,
        qualificationFee: 0,
        subtotal: 0,
        taxes: 0,
        operationalFee: 0,
        partnerCommission: 0,
        finalPrice: 235.87,
      },
      {
        id: "demo-2",
        name: "Desenvolvimento de Landing Page",
        description: "Criação completa de landing page responsiva e otimizada para conversão. Inclui design UI/UX, desenvolvimento front-end e integração de formulários.",
        category: "Desenvolvimento Web",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        variations: [
          { id: "v5", label: "1 Página Simples", quantity: 1, priceModifier: 0 },
          { id: "v6", label: "1 Página + Integrações", quantity: 1, priceModifier: 450.0 },
          { id: "v7", label: "Multi-páginas (até 5)", quantity: 5, priceModifier: 1200.0 },
        ],
        addOns: [
          { id: "a7", name: "SEO Otimizado", price: 200.0, category: "extra" },
          { id: "a8", name: "Integração API", price: 350.0, category: "extra" },
          { id: "a9", name: "Analytics Setup", price: 150.0, category: "extra" },
          { id: "a10", name: "Hospedagem (1 ano)", price: 500.0, category: "extra" },
        ],
        tasks: [
          {
            id: "t5",
            name: "Planejamento e Wireframe",
            description: "Estruturação da arquitetura da informação e wireframes",
            dependencies: [],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: {
              id: "q3",
              title: "Briefing da Landing Page",
              description: "Informações sobre o projeto",
              questions: [
                {
                  id: "q3-1",
                  question: "Qual o objetivo principal da landing page?",
                  type: "select",
                  required: true,
                  options: ["Captação de Leads", "Venda de Produto", "Divulgação de Evento", "Outro"],
                  aiAssisted: false,
                },
                {
                  id: "q3-2",
                  question: "Descreva seu produto/serviço",
                  type: "multiline",
                  required: true,
                  aiAssisted: true,
                },
              ],
            },
            steps: [
              {
                id: "s8",
                name: "Arquitetura de Informação",
                description: "Definir estrutura e hierarquia do conteúdo",
                order: 1,
                estimatedHours: 5,
                specialtyId: 3,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
              {
                id: "s9",
                name: "Wireframes",
                description: "Criar wireframes das seções da página",
                order: 2,
                estimatedHours: 6,
                specialtyId: 3,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t6",
            name: "Design UI/UX",
            description: "Criação do design visual da interface",
            dependencies: ["t5"],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: null,
            steps: [
              {
                id: "s10",
                name: "Design System",
                description: "Definir cores, tipografia e componentes",
                order: 1,
                estimatedHours: 8,
                specialtyId: 1,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
              {
                id: "s11",
                name: "Design das Telas",
                description: "Criar mockups finais desktop e mobile",
                order: 2,
                estimatedHours: 12,
                specialtyId: 1,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t7",
            name: "Desenvolvimento Front-end",
            description: "Codificação da landing page",
            dependencies: ["t6"],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: null,
            steps: [
              {
                id: "s12",
                name: "Setup do Projeto",
                description: "Configurar ambiente Next.js e dependências",
                order: 1,
                estimatedHours: 3,
                specialtyId: 4,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
              {
                id: "s13",
                name: "Implementação de Componentes",
                description: "Desenvolver componentes React reutilizáveis",
                order: 2,
                estimatedHours: 16,
                specialtyId: 4,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
              {
                id: "s14",
                name: "Responsividade",
                description: "Garantir funcionamento em todos os dispositivos",
                order: 3,
                estimatedHours: 8,
                specialtyId: 4,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
            ],
          },
          {
            id: "t8",
            name: "Testes e Deploy",
            description: "Testes de qualidade e publicação",
            dependencies: ["t7"],
            canRunInParallel: false,
            calculatedCost: 0,
            questionnaire: null,
            steps: [
              {
                id: "s15",
                name: "Testes de Qualidade",
                description: "Testar funcionalidades e performance",
                order: 1,
                estimatedHours: 6,
                specialtyId: 4,
                experienceLevel: "pleno",
                calculatedCost: 0,
              },
              {
                id: "s16",
                name: "Deploy",
                description: "Publicar em ambiente de produção",
                order: 2,
                estimatedHours: 4,
                specialtyId: 4,
                experienceLevel: "senior",
                calculatedCost: 0,
              },
            ],
          },
        ],
        totalTasksCost: 0,
        qualificationFee: 0,
        subtotal: 0,
        taxes: 0,
        operationalFee: 0,
        partnerCommission: 0,
        finalPrice: 2850.0,
      },
    ]
  })

  useEffect(() => {
    if (products.length >= 0) {
      localStorage.setItem("allka-products", JSON.stringify(products))
    }
  }, [products])

  const calculateStepCost = (hours: number, specialtyId: number, level: keyof Specialty["rates"]): number => {
    const specialty = specialties.find((s) => s.id === specialtyId)
    if (!specialty) return 0

    const hourlyRate = specialty.rates[level]
    return hours * hourlyRate
  }

  const calculateTaskCost = (task: Task): number => {
    return task.steps.reduce((sum, step) => sum + step.calculatedCost, 0)
  }

  const calculateProductPricing = (product: Product): Product => {
    if (!product.tasks || !Array.isArray(product.tasks)) {
      return {
        ...product,
        tasks: [],
        totalTasksCost: 0,
        qualificationFee: 0,
        subtotal: 0,
        taxes: 0,
        operationalFee: 0,
        partnerCommission: 0,
        finalPrice: 0,
      }
    }

    const updatedTasks = product.tasks.map((task) => {
      const updatedSteps = task.steps.map((step) => {
        if (step.specialtyId && step.experienceLevel) {
          return {
            ...step,
            calculatedCost: calculateStepCost(step.estimatedHours, step.specialtyId, step.experienceLevel),
          }
        }
        return { ...step, calculatedCost: 0 }
      })

      const taskCost = updatedSteps.reduce((sum, step) => sum + step.calculatedCost, 0)

      return {
        ...task,
        steps: updatedSteps,
        calculatedCost: taskCost,
      }
    })

    const totalTasksCost = updatedTasks.reduce((sum, task) => sum + task.calculatedCost, 0)

    const activeCommissions = pricingComponents.filter((c) => c.isActive && c.type === "commission")
    const activeFees = pricingComponents.filter((c) => c.isActive && c.type === "fee")
    const activeTaxes = pricingComponents.filter((c) => c.isActive && c.type === "tax")

    const commissionsTotal = activeCommissions
      .filter((c) => c.valueType === "percentage")
      .reduce((sum, c) => sum + (totalTasksCost * c.value) / 100, 0)

    const feesPercentage = activeFees
      .filter((c) => c.valueType === "percentage")
      .reduce((sum, c) => sum + (totalTasksCost * c.value) / 100, 0)
    const feesFixed = activeFees.filter((c) => c.valueType === "fixed").reduce((sum, c) => sum + c.value, 0)
    const feesTotal = feesPercentage + feesFixed

    const taxesTotal = activeTaxes
      .filter((c) => c.valueType === "percentage")
      .reduce((sum, c) => sum + (totalTasksCost * c.value) / 100, 0)

    const subtotal = totalTasksCost + commissionsTotal
    const finalPrice = subtotal + feesTotal + taxesTotal

    return {
      ...product,
      tasks: updatedTasks,
      totalTasksCost,
      qualificationFee: commissionsTotal,
      subtotal,
      taxes: taxesTotal,
      operationalFee: feesTotal,
      partnerCommission: 0,
      finalPrice,
    }
  }

  const addProduct = (product: Product) => {
    const calculatedProduct = calculateProductPricing(product)
    setProducts((prev) => [...prev, calculatedProduct])
  }

  const updateProduct = (id: string, product: Product) => {
    const calculatedProduct = calculateProductPricing(product)
    setProducts((prev) => prev.map((p) => (p.id === id ? calculatedProduct : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        calculateStepCost,
        calculateTaskCost,
        calculateProductPricing,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
