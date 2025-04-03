
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ className, separator, children, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children)
  const childrenWithSeparators = childrenArray.map((child, index) => {
    if (index === 0) {
      return child
    }
    return (
      <React.Fragment key={index}>
        {separator || <BreadcrumbSeparator />}
        {child}
      </React.Fragment>
    )
  })

  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn("flex items-center flex-wrap", className)}
      {...props}
    >
      <ol className="flex items-center flex-wrap gap-1.5">{childrenWithSeparators}</ol>
    </nav>
  )
})
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5 text-sm", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
    isCurrentPage?: boolean
  }
>(({ className, asChild, isCurrentPage, ...props }, ref) => {
  const Component = asChild ? React.Fragment : "a"

  return (
    <Component
      aria-current={isCurrentPage ? "page" : undefined}
      className={cn(
        "inline-flex items-center text-sm transition-colors hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isCurrentPage ? "text-foreground font-medium pointer-events-none" : "text-muted-foreground cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("text-muted-foreground", className)}
    {...props}
  >
    <ChevronRight className="h-3.5 w-3.5" />
  </span>
))
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
}
