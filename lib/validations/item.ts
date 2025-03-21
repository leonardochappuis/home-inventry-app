import * as z from "zod"

export const itemFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  purchasePrice: z.preprocess(
    // Convert empty string to undefined, then to number
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Price must be a positive number"),
  ),
  currentValue: z.preprocess(
    // Convert empty string to undefined, then to number
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Value must be a positive number").optional(),
  ),
  location: z.string().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  warrantyProvider: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  warrantyDetails: z.string().optional(),
  notes: z.string().optional(),
})

export type ItemFormValues = z.infer<typeof itemFormSchema>

