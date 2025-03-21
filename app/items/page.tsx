"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "@/components/search"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Trash, Home, Menu } from "lucide-react"
import { useInventory } from "@/lib/inventory-context"
import { useToast } from "@/hooks/use-toast"
import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"
// Import the new component
import { DirectAddButton } from "@/components/direct-add-button"

export default function ItemsPage() {
  const { items, deleteItem } = useInventory()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState<Item[]>(items)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Filter items when search term or items change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items)
      return
    }

    const query = searchTerm.toLowerCase()
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        (item.model && item.model.toLowerCase().includes(query)) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(query)),
    )

    setFilteredItems(filtered)
  }, [searchTerm, items])

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete)
      setItemToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Item deleted",
        description: "The item has been deleted successfully.",
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex md:hidden items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" passHref>
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">All Items</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[57px] z-20 bg-background border-b transition-all duration-200 ease-in-out",
          mobileMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="p-4 space-y-2">
          <Search value={searchTerm} onChange={setSearchTerm} />
          <DirectAddButton className="w-full" />
          {searchTerm && (
            <div className="py-2">
              <Badge variant="secondary">Search: {searchTerm}</Badge>
            </div>
          )}
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Desktop Header */}
        <div className="items-center justify-between hidden md:flex">
          <div className="flex items-center gap-2">
            <Link href="/" passHref>
              <Button variant="outline" size="icon">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">All Items</h1>
            {searchTerm && (
              <Badge variant="secondary" className="ml-2">
                Search: {searchTerm}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Search value={searchTerm} onChange={setSearchTerm} />
            <DirectAddButton />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? `No items found matching "${searchTerm}"` : "No items in your inventory yet"}
            </p>
            <DirectAddButton>Add Your First Item</DirectAddButton>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 md:mt-0">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md group relative">
                <Link href={`/items/${item.id}`} className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-all group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="font-medium">
                        ${item.currentValue?.toLocaleString() || item.purchasePrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteItem(item.id)
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

