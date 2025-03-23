"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface DirectAddButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  children?: React.ReactNode
}

export function DirectAddButton({ className, variant = "default", children }: DirectAddButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push("/items/add")
  }

  return (
    <Button className={className} variant={variant} onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      {children || "Add Item"}
    </Button>
  )
}

