"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingBag, Clock } from "lucide-react"
import { useInventory } from "@/lib/inventory-context"
import { useMemo } from "react"

export function Stats() {
  const { items, categories } = useInventory()

  // Calculate total value of all items
  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.currentValue || item.purchasePrice), 0)
  }, [items])

  // Count items with warranties expiring in the next 30 days
  const warrantiesExpiring = useMemo(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return items.filter((item) => {
      if (!item.warranty?.expiryDate) return false
      const expiryDate = new Date(item.warranty.expiryDate)
      return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date()
    }).length
  }, [items])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{items.length}</div>
          <p className="text-xs text-muted-foreground">All inventory items</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Current estimated value</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground">Across your inventory</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warranties Expiring</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{warrantiesExpiring}</div>
          <p className="text-xs text-muted-foreground">In the next 30 days</p>
        </CardContent>
      </Card>
    </>
  )
}

