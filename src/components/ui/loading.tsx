import React from "react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  variant?: "default" | "secondary" | "primary"
}

const sizes = {
  sm: "h-4 w-4 border-2",
  default: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3"
}

const variants = {
  default: "border-foreground/20 border-t-foreground",
  secondary: "border-secondary/30 border-t-secondary",
  primary: "border-primary/30 border-t-primary"
}

export const Loading = ({
  size = "default",
  variant = "default",
  className,
  ...props
}: LoadingProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  )
} 