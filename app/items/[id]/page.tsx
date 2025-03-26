"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, Trash, CalendarIcon, DollarSign, Tag, Pencil } from "lucide-react"
import type { Item } from "@/lib/types"
import { useInventory } from "@/lib/inventory-context"
import { toast } from "sonner"
import { ImageGallery } from "@/components/image-gallery"

export default function ItemDetailPage() {
  // Get the item ID directly from params
  const params = useParams()
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id || ""

  const router = useRouter()
  const { getItem, deleteItem, restoreItem } = useInventory()
  const [item, setItem] = useState<Item | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchedItem = getItem(itemId as string)
    if (fetchedItem) {
      setItem(fetchedItem)
    } else {
      // If item not found, redirect to home page
      router.push("/")
    }
  }, [itemId, getItem, router])

  const handleDelete = () => {
    if (itemId && item) {
      const deletedItem = item
      deleteItem(itemId)
      setIsDeleteDialogOpen(false)

      toast("Item deleted", {
        description: "The item has been deleted successfully.",
        action: {
          label: "Undo",
          onClick: () => {
            restoreItem(deletedItem)
            toast("Item restored", {
              description: "The item has been restored successfully.",
            })
          },
        },
      })

      router.push("/")
    }
  }

  // Helper function to format date or return N/A
  const formatDateOrNA = (dateString: string | undefined) => {
    if (!dateString) return "N/A"

    // Try to create a valid date
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A"
    }

    return date.toLocaleDateString()
  }

  if (!item) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {/* Header with navigation and action buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" passHref>
              <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
                <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{item.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none" asChild>
              <Link href={`/items/${itemId}/edit?from=item`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" className="flex-1 sm:flex-none" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Details section - moved up for mobile */}
          <div className="space-y-6 order-1 md:order-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Basic information about this item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Category
                    </div>
                    <div>
                      <Badge>{item.category}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Purchase Date
                    </div>
                    <div>{formatDateOrNA(item.purchaseDate)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Purchase Price
                    </div>
                    <div>${item.purchasePrice.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Current Value
                    </div>
                    <div>${item.currentValue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Location</div>
                    <div>{item.location || "N/A"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Model</div>
                    <div>{item.model || "N/A"}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Serial Number</div>
                  <div className="font-mono break-all">{item.serialNumber || "N/A"}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Description</div>
                  <div className="whitespace-pre-wrap">{item.description || "N/A"}</div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="warranty" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="warranty">Warranty</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="warranty" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {item.warranty ? (
                      <>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground">Provider</div>
                          <div>{item.warranty.provider || "N/A"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground">Expiry Date</div>
                          <div>{formatDateOrNA(item.warranty.expiryDate)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground">Details</div>
                          <div className="whitespace-pre-wrap">{item.warranty.details || "N/A"}</div>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground py-4">No warranty available</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {item.notes ? (
                      <div className="whitespace-pre-wrap">{item.notes}</div>
                    ) : (
                      <div className="text-muted-foreground py-4">N/A</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Images section - moved down for mobile */}
          <div className="space-y-6 order-2 md:order-1">
            <ImageGallery images={item.images} alt={item.name} />
          </div>
        </div>

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
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

