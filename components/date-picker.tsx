"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export function DatePicker({ date, onSelect, placeholder = "Pick a date", disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={() => setOpen(true)} className="w-full cursor-pointer">
          <Button
            type="button"
            variant="outline"
            className={`w-full h-10 px-3 py-2 text-left font-normal flex justify-between items-center ${!date ? "text-muted-foreground" : ""}`}
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
            <CalendarIcon className="h-4 w-4 opacity-50 ml-auto" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onSelect(selectedDate)
            setOpen(false)
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

