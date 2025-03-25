import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
  dotClassName?: string
  delay?: number
}

export function LoadingDots({
  className,
  dotClassName,
  delay = 300
}: LoadingDotsProps) {
  return (
    <div className="flex items-center justify-center w-full p-2">
      <div className={cn("flex space-x-1", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full bg-foreground/60 animate-bounce",
            dotClassName
          )}
          style={{ animationDelay: `${i * delay}ms` }}
        />
      ))}
      </div>
    </div>
  )
} 