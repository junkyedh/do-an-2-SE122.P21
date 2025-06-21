import React, { createContext, useContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import "./Toast.scss"
import { cn } from "@/modules/utils"

export interface Toast {
  id: string
  title?: string
  message: string
  type: "success" | "error" | "warning" | "info"
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
  success: (message: string, options?: Partial<Toast>) => void
  error: (message: string, options?: Partial<Toast>) => void
  warning: (message: string, options?: Partial<Toast>) => void
  info: (message: string, options?: Partial<Toast>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const ToastIcon = ({ type }: { type: Toast["type"] }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }

  const Icon = icons[type]
  return <Icon className="toast__icon" />
}

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  React.useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={cn("toast", `toast--${toast.type}`)}>
      <div className="toast__content">
        <ToastIcon type={toast.type} />
        <div className="toast__text">
          {toast.title && <div className="toast__title">{toast.title}</div>}
          <div className="toast__message">{toast.message}</div>
        </div>
      </div>

      <div className="toast__actions">
        {toast.action && (
          <button className="toast__action-btn" onClick={toast.action.onClick}>
            {toast.action.label}
          </button>
        )}
        <button className="toast__close-btn" onClick={() => onRemove(toast.id)}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message: string, options?: Partial<Toast>) => {
      addToast({ ...options, message, type: "success" })
    },
    [addToast],
  )

  const error = useCallback(
    (message: string, options?: Partial<Toast>) => {
      addToast({ ...options, message, type: "error" })
    },
    [addToast],
  )

  const warning = useCallback(
    (message: string, options?: Partial<Toast>) => {
      addToast({ ...options, message, type: "warning" })
    },
    [addToast],
  )

  const info = useCallback(
    (message: string, options?: Partial<Toast>) => {
      addToast({ ...options, message, type: "info" })
    },
    [addToast],
  )

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="toast-container">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}
