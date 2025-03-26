export interface Item {
  id: string
  name: string
  description?: string
  category: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  location?: string
  serialNumber?: string
  model?: string
  warranty?: Warranty
  notes?: string
  images: string[]
  timestamp?: string
}

export interface Warranty {
  provider: string
  expiryDate: string
  details?: string
}

export interface Category {
  id: string
  name: string
  itemCount: number
}

