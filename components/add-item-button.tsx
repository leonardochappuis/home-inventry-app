"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddItemButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  children?: React.ReactNode
}

export function AddItemButton({ className, variant = "default", children }: AddItemButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Added to to prevent event bubbling
    router.push("/items/add")
  }

  return (
    <Button className={className} variant={variant} onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      {children || "Add Item"}
    </Button>
  )
}

