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
  receipts?: Receipt[]
  notes?: string
  images: string[]
}

export interface Warranty {
  provider: string
  expiryDate: string
  details?: string
}

export interface Receipt {
  id: string
  name: string
  date: string
  url: string
  file?: string // This will store the data URL for uploaded files
}

export interface Category {
  id: string
  name: string
  itemCount: number
}

