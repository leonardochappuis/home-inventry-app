"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative aspect-video overflow-hidden rounded-lg cursor-pointer">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={alt}
              fill
              className="object-cover transition-all hover:scale-105"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <DialogTitle className="sr-only">Image Gallery for {alt}</DialogTitle>
          <DialogDescription className="sr-only">
            View and navigate through images of {alt}. Use left and right buttons to navigate between images.
          </DialogDescription>

          <div className="relative h-[80vh] bg-black rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="relative h-full w-full flex items-center justify-center">
              <Image src={images[currentImageIndex] || "/placeholder.svg"} alt={alt} fill className="object-contain" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-10 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-10 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-md cursor-pointer ${
                index === currentImageIndex ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${alt} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

