import React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import "./Toast.scss"
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react"
import { Button } from "../Button/Button"
import { cn } from "@/modules/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const ToastItem: React.FC<{
  toast: Toast
  onRemove: (id: string) => void
}> = ({ toast, onRemove }) => {
  const Icon = toastIcons[toast.type]

  return (
    <div className={cn("toast", `toast-${toast.type}`)}>
      <div className="toast-icon">
        <Icon />
      </div>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
        {toast.action && (
          <Button variant="link" size="sm" onClick={toast.action.onClick} className="toast-action">
            {toast.action.label}
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={<X />}
        onClick={() => onRemove(toast.id)}
        className="toast-close"
        aria-label="Close notification"
      />
    </div>
  )
}

const ToastContainer: React.FC<{
  toasts: Toast[]
  onRemove: (id: string) => void
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast = { ...toast, id }

      setToasts((prev) => [...prev, newToast])

      // Auto remove after duration
      const duration = toast.duration ?? 5000
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast],
  )

  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "success", message, title })
    },
    [addToast],
  )

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "error", message, title, duration: 7000 })
    },
    [addToast],
  )

  const warning = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "warning", message, title })
    },
    [addToast],
  )

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "info", message, title })
    },
    [addToast],
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}
