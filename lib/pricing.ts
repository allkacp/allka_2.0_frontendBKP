import type { AccountType, AccountSubType } from "@/contexts/account-type-context"

export function calculateDiscount(
  accountType: AccountType,
  accountSubType: AccountSubType | null,
  creditPlan?: number,
): number {
  if (accountType === "agencias") {
    // Agency credit plan discounts
    if (creditPlan === 500) return 0.1 // 10%
    if (creditPlan === 1000) return 0.15 // 15%
    if (creditPlan === 1500) return 0.2 // 20%
    return 0 // No discount without credit plan
  }

  if (accountType === "empresas" && accountSubType === "company") {
    return 0.05 // 5% discount for company accounts
  }

  return 0 // No discount for other account types
}

export function calculatePrice(
  basePrice: number,
  accountType: AccountType,
  accountSubType: AccountSubType | null,
  creditPlan?: number,
): number {
  const discount = calculateDiscount(accountType, accountSubType, creditPlan)
  return basePrice * (1 - discount)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}
