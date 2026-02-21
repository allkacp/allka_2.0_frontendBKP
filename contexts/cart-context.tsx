"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/types/product"

export interface CartItem {
  id: string // Added unique ID to differentiate items with different customizations
  product: Product
  quantity: number
  selectedVariation?: {
    id: string
    name: string
    priceModifier: number
  }
  selectedAddons?: Array<{
    id: string
    name: string
    price: number
  }>
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, customization?: { variation?: any; addons?: any[] }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(items))
  }, [items])

  const generateCartItemId = (
    productId: string,
    variation?: { id: string; name: string; priceModifier: number },
    addons?: Array<{ id: string; name: string; price: number }>,
  ) => {
    const variationId = variation?.id || "none"
    const addonIds =
      addons
        ?.map((a) => a.id)
        .sort()
        .join("-") || "none"
    return `${productId}-${variationId}-${addonIds}`
  }

  const addItem = (product: Product, quantity = 1, customization?: { variation?: any; addons?: any[] }) => {
    console.log("[v0] Adding item to cart:", { product: product.name, quantity, customization })

    setItems((prevItems) => {
      const cartItemId = generateCartItemId(product.id, customization?.variation, customization?.addons)

      const existingItem = prevItems.find((item) => item.id === cartItemId)

      if (existingItem) {
        console.log("[v0] Item already exists, updating quantity")
        return prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      console.log("[v0] Creating new cart item with ID:", cartItemId)
      const newItem: CartItem = {
        id: cartItemId,
        product,
        quantity,
      }

      // Add customization if provided
      if (customization?.variation) {
        newItem.selectedVariation = customization.variation
      }
      if (customization?.addons) {
        newItem.selectedAddons = customization.addons
      }

      return [...prevItems, newItem]
    })
  }

  const removeItem = (cartItemId: string) => {
    console.log("[v0] Removing item from cart:", cartItemId)
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    console.log("[v0] Updating quantity:", { cartItemId, quantity })
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    const total = items.reduce((total, item) => {
      const basePrice = item.product.basePrice
      const variationModifier = item.selectedVariation?.priceModifier || 1
      const addonsPrice = item.selectedAddons?.reduce((sum, addon) => sum + addon.price, 0) || 0
      const itemPrice = (basePrice * variationModifier + addonsPrice) * item.quantity
      console.log("[v0] Item price calculation:", {
        product: item.product.name,
        basePrice,
        variationModifier,
        addonsPrice,
        quantity: item.quantity,
        itemPrice,
      })
      return total + itemPrice
    }, 0)

    console.log("[v0] Total cart price:", total)
    return total
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
