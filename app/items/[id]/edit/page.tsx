'use client';

import type React from 'react';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  X,
  Camera,
  Image,
  FileText,
  Eye,
  Trash,
  Upload,
  Link2,
} from 'lucide-react';
import type { Item, Receipt } from '@/lib/types';
import { useInventory } from '@/lib/inventory-context';
import { useToast } from '@/hooks/use-toast';

// Placeholder images for different categories
const placeholderImages = {
  Electronics: [
    '/placeholder.svg?height=400&width=600&text=Electronics+1',
    '/placeholder.svg?height=400&width=600&text=Electronics+2',
    '/placeholder.svg?height=400&width=600&text=Electronics+3',
  ],
  Furniture: [
    '/placeholder.svg?height=400&width=600&text=Furniture+1',
    '/placeholder.svg?height=400&width=600&text=Furniture+2',
    '/placeholder.svg?height=400&width=600&text=Furniture+3',
  ],
  Appliances: [
    '/placeholder.svg?height=400&width=600&text=Appliances+1',
    '/placeholder.svg?height=400&width=600&text=Appliances+2',
    '/placeholder.svg?height=400&width=600&text=Appliances+3',
  ],
  Jewelry: [
    '/placeholder.svg?height=400&width=600&text=Jewelry+1',
    '/placeholder.svg?height=400&width=600&text=Jewelry+2',
    '/placeholder.svg?height=400&width=600&text=Jewelry+3',
  ],
  Art: [
    '/placeholder.svg?height=400&width=600&text=Art+1',
    '/placeholder.svg?height=400&width=600&text=Art+2',
    '/placeholder.svg?height=400&width=600&text=Art+3',
  ],
  Clothing: [
    '/placeholder.svg?height=400&width=600&text=Clothing+1',
    '/placeholder.svg?height=400&width=600&text=Clothing+2',
    '/placeholder.svg?height=400&width=600&text=Clothing+3',
  ],
  Default: [
    '/placeholder.svg?height=400&width=600&text=Item+1',
    '/placeholder.svg?height=400&width=600&text=Item+2',
    '/placeholder.svg?height=400&width=600&text=Item+3',
  ],
};

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id: itemId } = use(params);

  const router = useRouter();
  const { getItem, updateItem, categories } = useInventory();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    location: '',
    serialNumber: '',
    model: '',
    warrantyProvider: '',
    warrantyExpiry: '',
    warrantyDetails: '',
    notes: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Default');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const item = getItem(itemId);

    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        description: item.description || '',
        purchaseDate: item.purchaseDate || '',
        purchasePrice: item.purchasePrice || 0,
        currentValue: item.currentValue || 0,
        location: item.location || '',
        serialNumber: item.serialNumber || '',
        model: item.model || '',
        warrantyProvider: item.warranty?.provider || '',
        warrantyExpiry: item.warranty?.expiryDate || '',
        warrantyDetails: item.warranty?.details || '',
        notes: item.notes || '',
      });
      setImages(item.images || []);
      setReceipts(item.receipts || []);
      setSelectedCategory(item.category || 'Default');
      setIsLoaded(true);
    } else {
      // If item not found, redirect to items page
      router.push('/items');
    }
  }, [itemId, getItem, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // For number inputs, store the raw value (even if empty)
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'category') {
      setSelectedCategory(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImages((prev) => [...prev, event.target.result]);
        }
      };

      reader.readAsDataURL(file);
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setUploading(false);

    toast({
      title: 'Images uploaded',
      description: 'Your images have been added successfully.',
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addPlaceholderImage = (image: string) => {
    setImages((prev) => [...prev, image]);
    setShowPlaceholders(false);

    toast({
      title: 'Placeholder added',
      description: 'Placeholder image has been added to your item.',
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const newReceipt = {
            id: `receipt-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            name: file.name,
            date: new Date().toISOString().split('T')[0],
            url: '#',
            file: event.target.result,
          };
          setReceipts((prev) => [...prev, newReceipt]);
        }
      };

      reader.readAsDataURL(file);
    });

    // Reset the file input
    if (receiptFileInputRef.current) {
      receiptFileInputRef.current.value = '';
    }

    setUploading(false);

    toast({
      title: 'Receipt uploaded',
      description: 'Your receipt has been added successfully.',
    });
  };

  const triggerReceiptFileInput = () => {
    if (receiptFileInputRef.current) {
      receiptFileInputRef.current.click();
    }
  };

  const removeReceipt = (id: string) => {
    setReceipts(receipts.filter((receipt) => receipt.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create updated item object
    const updatedItem: Partial<Item> = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      purchaseDate: formData.purchaseDate,
      purchasePrice:
        formData.purchasePrice === '' ? 0 : Number(formData.purchasePrice),
      currentValue:
        formData.currentValue === '' ? 0 : Number(formData.currentValue),
      location: formData.location,
      serialNumber: formData.serialNumber,
      model: formData.model,
      warranty:
        formData.warrantyProvider ||
        formData.warrantyExpiry ||
        formData.warrantyDetails
          ? {
              provider: formData.warrantyProvider || '',
              expiryDate: formData.warrantyExpiry || '',
              details: formData.warrantyDetails || '',
            }
          : undefined,
      notes: formData.notes,
      images: images,
      receipts: receipts,
    };

    // Update the item
    updateItem(itemId, updatedItem);

    toast({
      title: 'Item updated',
      description: 'Your item has been updated successfully.',
    });

    // Redirect to item detail page
    router.push(`/items/${itemId}`);
  };

  // Don't render until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href={`/items/${itemId}`} passHref>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="order-2 md:order-1">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Update the details of your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange('category', value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="h-10"
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input
                      id="purchasePrice"
                      name="purchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentValue">Current Value ($)</Label>
                    <Input
                      id="currentValue"
                      name="currentValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.currentValue}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Item Images</CardTitle>
                  <CardDescription>Update photos of your item</CardDescription>
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
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={image || '/placeholder.svg'}
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
                    ))}
                  </div>

                  {showPlaceholders ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm">
                        Select a placeholder image:
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {placeholderImages[
                          selectedCategory in placeholderImages
                            ? selectedCategory
                            : 'Default'
                        ].map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:border-primary"
                            onClick={() => addPlaceholderImage(image)}
                          >
                            <img
                              src={image || '/placeholder.svg'}
                              alt={`Placeholder ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowPlaceholders(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-16 border-dashed"
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
                            <span className="text-sm">Upload from Device</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-16 border-dashed"
                        onClick={() => setShowPlaceholders(true)}
                      >
                        <div className="flex flex-col items-center">
                          <Camera className="h-5 w-5 mb-1" />
                          <span className="text-sm">Use Placeholder</span>
                        </div>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warranty Information</CardTitle>
                  <CardDescription>
                    Update warranty details if applicable
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyProvider">Provider</Label>
                    <Input
                      id="warrantyProvider"
                      name="warrantyProvider"
                      value={formData.warrantyProvider}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Expiry Date</Label>
                    <Input
                      id="warrantyExpiry"
                      name="warrantyExpiry"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyDetails">Details</Label>
                    <Textarea
                      id="warrantyDetails"
                      name="warrantyDetails"
                      value={formData.warrantyDetails}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receipts</CardTitle>
                  <CardDescription>
                    Upload and manage receipts for this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Hidden file input for receipts */}
                  <input
                    type="file"
                    ref={receiptFileInputRef}
                    onChange={handleReceiptFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />

                  <div className="space-y-4">
                    {receipts.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {receipts.map((receipt) => (
                          <div
                            key={receipt.id}
                            className="flex items-center justify-between p-3"
                          >
                            <div className="flex items-center gap-3">
                              {receipt.file ? (
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                  <Link2 className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm">
                                  {receipt.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(receipt.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {receipt.file && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a
                                    href={receipt.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeReceipt(receipt.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No receipts added yet
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={triggerReceiptFileInput}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>
                    Additional information about this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Add any additional notes about this item..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link href={`/items/${itemId}`}>Cancel</Link>
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
