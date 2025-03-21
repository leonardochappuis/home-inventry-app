"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export function Search({ value, onChange }: SearchProps) {
  const handleClear = () => {
    onChange("")
  }

  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search items..."
        className="pr-16"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-8 top-0 h-full"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <div className="absolute right-0 top-0 h-full flex items-center justify-center w-8">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

