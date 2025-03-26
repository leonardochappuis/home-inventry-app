"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "@/components/search"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash, Plus, Pencil } from "lucide-react"
import { useInventory } from "@/lib/inventory-context"
import { toast } from "sonner"
import type { Item } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { items, deleteItem, restoreItem } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState<Item[]>(items)
  const router = useRouter()

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
      const itemToRestore = items.find((item) => item.id === itemToDelete)

      if (itemToRestore) {
        deleteItem(itemToDelete)
        setItemToDelete(null)
        setIsDeleteDialogOpen(false)

        toast("Item deleted", {
          description: "The item has been deleted successfully.",
          action: {
            label: "Undo",
            onClick: () => {
              restoreItem(itemToRestore)
              toast("Item restored", {
                description: "The item has been restored successfully.",
              })
            },
          },
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 md:hidden flex flex-col">
        <div className="w-full mb-3">
          <h1 className="text-xl font-bold">Home Inventory</h1>
          <p className="text-sm text-muted-foreground">Document your belongings for insurance purposes</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <Search value={searchTerm} onChange={setSearchTerm} />
          <Button onClick={() => router.push("/items/add")} className="flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between md:mt-0 mt-2">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold tracking-tight">Home Inventory</h1>
            <p className="text-muted-foreground mt-1">Document your belongings for insurance purposes</p>
          </div>
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Search value={searchTerm} onChange={setSearchTerm} />
            <Button onClick={() => router.push("/items/add")} className="flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {searchTerm && (
          <div className="py-2">
            <Badge variant="secondary">Search: {searchTerm}</Badge>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? `No items found matching "${searchTerm}"` : "No items in your inventory yet"}
            </p>
            <Button onClick={() => router.push("/items/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(`/items/${item.id}/edit?from=dashboard`)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

