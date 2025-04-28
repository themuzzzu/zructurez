
import { useState, useCallback } from 'react'

type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error'

interface ToastProps {
  id?: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    function ({
      id = String(Math.random()),
      title,
      description,
      type = 'default',
      duration = 5000,
    }: ToastProps) {
      setToasts((toasts) => [...toasts, { id, title, description, type, duration }])

      if (duration !== Infinity) {
        setTimeout(() => {
          setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
        }, duration)
      }

      return {
        id,
        dismiss: () => setToasts((toasts) => toasts.filter((toast) => toast.id !== id)),
        update: (props: Omit<Partial<ToastProps>, 'id'>) => {
          setToasts((toasts) =>
            toasts.map((toast) =>
              toast.id === id ? { ...toast, ...props } : toast
            )
          )
        },
      }
    },
    []
  )

  return {
    toasts,
    toast,
    dismiss: (id: string) => setToasts((toasts) => toasts.filter((toast) => toast.id !== id)),
    dismissAll: () => setToasts([]),
  }
}

export const toast = {
  success: (title: string, description?: string) => {
    // This is just a stub that should probably connect to sonner
    console.log('TOAST SUCCESS:', title, description)
  },
  error: (title: string, description?: string) => {
    console.log('TOAST ERROR:', title, description)
  },
  warning: (title: string, description?: string) => {
    console.log('TOAST WARNING:', title, description)
  },
  info: (title: string, description?: string) => {
    console.log('TOAST INFO:', title, description)
  },
}
