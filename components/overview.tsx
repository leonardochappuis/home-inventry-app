"use client"

import { useInventory } from "@/lib/inventory-context"
import { useEffect, useMemo } from "react"

export function Overview() {
  const { items, categories } = useInventory()

  // Debug log
  useEffect(() => {
    console.log("Overview component:", { items, categories })
  }, [items, categories])

  // Calculate total value by category
  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>()

    // Initialize all categories with 0
    categories.forEach((category) => {
      totals.set(category.name, 0)
    })

    // Sum up values for each category
    items.forEach((item) => {
      const currentTotal = totals.get(item.category) || 0
      totals.set(item.category, currentTotal + (item.currentValue || item.purchasePrice))
    })

    // Convert to array format
    return Array.from(totals.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total) // Sort by value descending
      .slice(0, 6) // Take top 6 categories
  }, [items, categories])

  // More debug logs
  useEffect(() => {
    console.log("Category totals:", categoryTotals)
  }, [categoryTotals])

  return (
    <div className="w-full h-[240px] flex flex-col">
      {/* Debug info */}
      <div className="text-xs text-muted-foreground mb-2">
        Items: {items.length}, Categories: {categories.length}, Data points: {categoryTotals.length}
      </div>

      {categoryTotals.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
      ) : (
        <div className="flex flex-col space-y-4 h-full overflow-y-auto">
          {categoryTotals.map((category) => (
            <div key={category.name} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm font-medium">${category.total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${(category.total / Math.max(...categoryTotals.map((c) => c.total))) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

