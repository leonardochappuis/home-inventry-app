"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, X, Image } from "lucide-react"
import { useInventory } from "@/lib/inventory-context"
import { toast } from "sonner"
import { itemFormSchema, type ItemFormValues } from "@/lib/validations/item"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Placeholder images for different categories
const placeholderImages = {
  Electronics: [
    "/placeholder.svg?height=400&width=600&text=Electronics+1",
    "/placeholder.svg?height=400&width=600&text=Electronics+2",
    "/placeholder.svg?height=400&width=600&text=Electronics+3",
  ],
  Furniture: [
    "/placeholder.svg?height=400&width=600&text=Furniture+1",
    "/placeholder.svg?height=400&width=600&text=Furniture+2",
    "/placeholder.svg?height=400&width=600&text=Furniture+3",
  ],
  Appliances: [
    "/placeholder.svg?height=400&width=600&text=Appliances+1",
    "/placeholder.svg?height=400&width=600&text=Appliances+2",
    "/placeholder.svg?height=400&width=600&text=Appliances+3",
  ],
  Jewelry: [
    "/placeholder.svg?height=400&width=600&text=Jewelry+1",
    "/placeholder.svg?height=400&width=600&text=Jewelry+2",
    "/placeholder.svg?height=400&width=600&text=Jewelry+3",
  ],
  Art: [
    "/placeholder.svg?height=400&width=600&text=Art+1",
    "/placeholder.svg?height=400&width=600&text=Art+2",
    "/placeholder.svg?height=400&width=600&text=Art+3",
  ],
  Clothing: [
    "/placeholder.svg?height=400&width=600&text=Clothing+1",
    "/placeholder.svg?height=400&width=600&text=Clothing+2",
    "/placeholder.svg?height=400&width=600&text=Clothing+3",
  ],
  Default: [
    "/placeholder.svg?height=400&width=600&text=Item+1",
    "/placeholder.svg?height=400&width=600&text=Item+2",
    "/placeholder.svg?height=400&width=600&text=Item+3",
  ],
}

export default function AddItemPage() {
  const router = useRouter()
  const { addItem, categories } = useInventory()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      purchaseDate: "",
      purchasePrice: 0,
      currentValue: 0,
      location: "",
      serialNumber: "",
      model: "",
      warrantyProvider: "",
      warrantyExpiry: "",
      warrantyDetails: "",
      notes: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const result = event.target?.result
        if (result && typeof result === "string") {
          setImages((prev) => [...prev, result])
        }
      }

      reader.readAsDataURL(file)
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setUploading(false)

    toast.success("Images uploaded successfully")
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = (data: ItemFormValues) => {
    // Create warranty object only if any warranty field has a value
    const warranty =
      data.warrantyProvider || data.warrantyExpiry || data.warrantyDetails
        ? {
            provider: data.warrantyProvider || "",
            expiryDate: data.warrantyExpiry || "",
            details: data.warrantyDetails || "",
          }
        : undefined

    // Create new item object
    const newItem = {
      name: data.name,
      category: data.category,
      description: data.description || "",
      purchaseDate: data.purchaseDate,
      purchasePrice: Number(data.purchasePrice),
      currentValue: Number(data.currentValue || data.purchasePrice),
      location: data.location || "",
      serialNumber: data.serialNumber || "",
      model: data.model || "",
      warranty,
      notes: data.notes || "",
      images: images.length > 0 ? images : ["/placeholder.svg?height=400&width=600&text=No+Image"],
    }

    // Add the item
    const id = addItem(newItem)

    toast.success("Item added successfully")

    // Navigate to the item detail page
    setTimeout(() => {
      router.push(`/items/${id}`)
    }, 100)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
              <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Item</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="order-2 md:order-1">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>Enter the details of your item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. MacBook Pro 16"' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Purchase Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal flex items-center justify-start ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Value ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Leave blank to use purchase price"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your item, including brand, model, color, etc."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. C02G3KYVMD6T" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Living Room, Garage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MacBook Pro 16-inch 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6 order-1 md:order-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Item Images</CardTitle>
                    <CardDescription>Upload photos of your item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {images.length > 0 ? (
                        images.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Item image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 rounded-full"
                              onClick={() => removeImage(index)}
                              type="button"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 aspect-video rounded-md overflow-hidden border">
                          <img
                            src="/placeholder.svg?height=400&width=600&text=No+Image"
                            alt="Default placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-16 border-dashed"
                      onClick={triggerFileInput}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          Uploading...
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Image className="h-5 w-5 mb-1" />
                          <span className="text-sm">Upload Images</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Warranty Information</CardTitle>
                    <CardDescription>Add warranty details if applicable</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="warrantyProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Apple Care+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warrantyExpiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal flex items-center justify-start ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warrantyDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional warranty information" rows={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Additional information about this item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Add any additional notes about this item..." rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit">Save Item</Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}

