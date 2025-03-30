
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "./card"
import { AspectRatio } from "./aspect-ratio"

const BusinessCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-[360px] bg-black text-white flex flex-col",
      className
    )}
    {...props}
  />
))
BusinessCard.displayName = "BusinessCard"

const BusinessCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src: string, alt: string }
>(({ className, src, alt, ...props }, ref) => (
  <div className="relative w-full">
    <AspectRatio 
      ratio={16/9} 
      className={cn("bg-muted", className)} 
      {...props}
    >
      <img 
        src={src || '/placeholder.svg'} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        ref={ref as React.Ref<HTMLImageElement>}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    </AspectRatio>
  </div>
))
BusinessCardImage.displayName = "BusinessCardImage"

const BusinessCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 space-y-3 flex-1 flex flex-col", className)}
    {...props}
  />
))
BusinessCardContent.displayName = "BusinessCardContent"

export { BusinessCard, BusinessCardImage, BusinessCardContent }
