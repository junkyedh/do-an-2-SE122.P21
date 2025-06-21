import React from "react"
import "./Input.scss"
import { cn } from "@/modules/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: "default" | "filled" | "outlined"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, variant = "default", ...props }, ref) => {
    return (
      <div className={cn("input-wrapper", className)}>
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        <div
          className={cn("input-container", `input-container--${variant}`, {
            "input-container--error": error,
            "input-container--with-left-icon": leftIcon,
            "input-container--with-right-icon": rightIcon,
          })}
        >
          {leftIcon && <div className="input-icon input-icon--left">{leftIcon}</div>}
          <input ref={ref} className={cn("input-field")} {...props} />
          {rightIcon && <div className="input-icon input-icon--right">{rightIcon}</div>}
        </div>
        {error && <div className="input-error">{error}</div>}
        {helperText && !error && <div className="input-helper">{helperText}</div>}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
