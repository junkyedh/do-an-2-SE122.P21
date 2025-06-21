import React from "react"
import "./Button.scss"
import { cn } from "@/modules/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "btn",
          `btn--${variant}`,
          `btn--${size}`,
          {
            "btn--loading": loading,
            "btn--disabled": disabled || loading,
          },
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <div className="btn__spinner" />}
        {icon && <span className="btn__icon">{icon}</span>}
        <span className="btn__text">{children}</span>
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
