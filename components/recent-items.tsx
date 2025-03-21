"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import { useInventory } from "@/lib/inventory-context"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecentItems() {
  const { items } = useInventory()

  // Get the 5 most recently added items
  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, 5)
  }, [items])

  if (recentItems.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No items added yet</p>
  }

  // Mobile view (card-based)
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {recentItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <Link href={`/items/${item.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.purchaseDate), { addSuffix: true })}
                  </p>
                  <p className="text-sm font-medium">${(item.currentValue || item.purchasePrice).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Desktop view (table-based)
  const DesktopView = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <div className="font-medium">{item.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.category}</Badge>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(item.purchaseDate), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">
                ${(item.currentValue || item.purchasePrice).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link href={`/items/${item.id}`}>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">View details</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  )
}

