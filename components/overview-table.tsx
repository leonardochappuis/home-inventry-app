"use client"

import { useInventory } from "@/lib/inventory-context"
import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function OverviewTable() {
  const { items, categories } = useInventory()

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
  }, [items, categories])

  return (
    <div className="w-full h-[240px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryTotals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            categoryTotals.map((category) => (
              <TableRow key={category.name}>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right font-medium">${category.total.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

