import * as React from "react"
import { EmblaCarousel } from "embla-carousel-react"
import {
  EmblaOptionsType,
  EmblaPluginType,
  EmblaViewportRefType,
} from "embla-carousel"

import { cn } from "@/lib/utils"

interface CarouselProps extends React.HTMLAttributes<HTMLElement> {
  plugins?: EmblaPluginType[]
  options?: EmblaOptionsType
  children: React.ReactNode
}

const Carousel = React.forwardRef<EmblaViewportRefType, CarouselProps>(
  ({ className, plugins = [], options = {}, children, ...props }, ref) => {
    const [emblaRef, setEmblaRef] = React.useState<EmblaViewportRefType>(null)

    React.useImperativeHandle(ref, () => emblaRef, [emblaRef])

    return (
      <div className={cn("relative", className)} {...props}>
        <EmblaCarousel
          plugins={plugins}
          options={options}
          emblaRef={(embla) => {
            setEmblaRef(embla)
          }}
        >
          <div className="flex select-none items-center outline-none">
            {children}
          </div>
        </EmblaCarousel>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

interface CarouselItemProps extends React.HTMLAttributes<HTMLElement> {
  index: number
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, index, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative min-w-0 flex-[1_0_100%] pl-2", className)}
        style={{
          paddingLeft: "calc(var(--carousel-padding) / 2)",
          paddingRight: "calc(var(--carousel-padding) / 2)",
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CarouselItem.displayName = "CarouselItem"

interface CarouselPreviousProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute left-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

interface CarouselNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
