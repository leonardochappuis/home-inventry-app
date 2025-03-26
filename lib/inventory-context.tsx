"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Item, Category } from "@/lib/types"

// Predefined categories
const predefinedCategories = [
  { id: "1", name: "Electronics", itemCount: 42 },
  { id: "2", name: "Furniture", itemCount: 18 },
  { id: "3", name: "Appliances", itemCount: 15 },
  { id: "4", name: "Jewelry", itemCount: 8 },
  { id: "5", name: "Art", itemCount: 12 },
  { id: "6", name: "Clothing", itemCount: 35 },
  { id: "7", name: "Books", itemCount: 27 },
  { id: "8", name: "Tools", itemCount: 19 },
  { id: "9", name: "Sports Equipment", itemCount: 14 },
  { id: "10", name: "Collectibles", itemCount: 23 },
]

// Initial data
const initialItems = [
  {
    id: "1",
    name: 'MacBook Pro 16"',
    description: "Apple MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD",
    category: "Electronics",
    purchaseDate: "2023-01-15",
    purchasePrice: 2499,
    currentValue: 2100,
    location: "Home Office",
    serialNumber: "C02G3KYVMD6T",
    model: "MacBook Pro 16-inch 2023",
    warranty: {
      provider: "Apple Care+",
      expiryDate: "2026-01-15",
      details: "Extended warranty with accidental damage coverage",
    },
    notes: "Used for work and personal projects. Includes charger and protective case.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Leather Sofa",
    category: "Furniture",
    purchaseDate: "2023-02-20",
    purchasePrice: 1200,
    currentValue: 1000,
    location: "Living Room",
    images: ["/placeholder.svg?height=200&width=200"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    name: 'Samsung 65" OLED TV',
    category: "Electronics",
    purchaseDate: "2023-03-10",
    purchasePrice: 1800,
    currentValue: 1500,
    location: "Living Room",
    images: ["/placeholder.svg?height=200&width=200"],
    timestamp: new Date().toISOString(),
  },
]

interface InventoryContextType {
  items: Item[]
  categories: Category[]
  getItem: (id: string) => Item | undefined
  addItem: (item: Omit<Item, "id">) => string
  updateItem: (id: string, item: Item) => void
  deleteItem: (id: string) => void
  restoreItem: (item: Item) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setItems(initialItems)
    setCategories(predefinedCategories)
  }, [])

  const getItem = (id: string) => {
    return items.find((item) => item.id === id)
  }

  const addItem = (item: Omit<Item, "id">) => {
    const id = `item-${Date.now()}`
    const newItem = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
    } as Item

    setItems((prev) => [...prev, newItem])

    // Update the item count for the category
    updateCategoryItemCount(item.category, 1)

    return id
  }

  const updateItem = (id: string, updatedItem: Item) => {
    const existingItem = items.find((item) => item.id === id)

    if (existingItem) {
      // If category changed, update category counts
      if (existingItem.category !== updatedItem.category) {
        updateCategoryItemCount(existingItem.category, -1)
        updateCategoryItemCount(updatedItem.category, 1)
      }

      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
    }
  }

  const deleteItem = (id: string) => {
    const item = items.find((item) => item.id === id)

    if (item) {
      // Update category item count when deleting an item
      updateCategoryItemCount(item.category, -1)

      // Remove the item from the list
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const restoreItem = (item: Item) => {
    // Add the item back to the list, preserving its original position
    setItems((prev) => {
      // Create a new array with the restored item
      const newItems = [...prev, item]

      // Sort items by their ID to maintain original order
      // This works because our IDs are timestamp-based (item-{timestamp})
      return newItems.sort((a, b) => {
        // Extract the numeric part from the ID for comparison
        const aId = a.id.startsWith("item-") ? Number.parseInt(a.id.substring(5)) : Number.parseInt(a.id)
        const bId = b.id.startsWith("item-") ? Number.parseInt(b.id.substring(5)) : Number.parseInt(b.id)

        // Sort in ascending order (oldest first)
        return aId - bId
      })
    })

    // Update the category count
    updateCategoryItemCount(item.category, 1)
  }

  // Helper function to update category item counts
  const updateCategoryItemCount = (categoryName: string, change: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.name === categoryName ? { ...cat, itemCount: Math.max(0, cat.itemCount + change) } : cat)),
    )
  }

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        getItem,
        addItem,
        updateItem,
        deleteItem,
        restoreItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

