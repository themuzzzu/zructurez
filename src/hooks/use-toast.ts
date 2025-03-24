
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 10000

type NotificationPriority = 'critical' | 'high' | 'medium' | 'low'

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  priority?: NotificationPriority
  category?: 'order' | 'payment' | 'system' | 'user' | 'message'
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Helper to get appropriate CSS classes based on priority and variant
const getToastClasses = (priority?: NotificationPriority, variant?: ToastProps["variant"]) => {
  if (variant === 'destructive') {
    return 'destructive border-destructive bg-destructive text-destructive-foreground'
  }
  
  switch (priority) {
    case 'critical':
      return 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-900 text-red-900 dark:text-red-200'
    case 'high':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-950 dark:border-orange-900 text-orange-900 dark:text-orange-200'
    case 'medium':
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 text-blue-900 dark:text-blue-200'
    default:
      return ''
  }
}

// Compare toasts based on priority for sorting
const comparePriority = (a: ToasterToast, b: ToasterToast) => {
  const priorityOrder: Record<NotificationPriority, number> = {
    critical: 0,
    high: 1, 
    medium: 2,
    low: 3
  }
  
  const aPriority = a.priority || 'low'
  const bPriority = b.priority || 'low'
  
  // First sort by priority
  if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
    return priorityOrder[aPriority] - priorityOrder[bPriority]
  }
  
  // Then sort by category (orders and payments first)
  const categoryOrder: Record<string, number> = {
    payment: 0,
    order: 1,
    system: 2,
    message: 3,
    user: 4
  }
  
  const aCategory = a.category || 'user'
  const bCategory = b.category || 'user'
  
  return (categoryOrder[aCategory] || 99) - (categoryOrder[bCategory] || 99)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast]
          .sort(comparePriority)
          .slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastParams = Omit<ToasterToast, "id"> & {
  priority?: NotificationPriority
  category?: 'order' | 'payment' | 'system' | 'user' | 'message'
}

function toast(props: ToastParams) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Apply custom classes based on priority
  const className = props.className ? 
    `${props.className} ${getToastClasses(props.priority, props.variant)}` : 
    getToastClasses(props.priority, props.variant)

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      className,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

// Helper functions for different toast types with pre-set priorities
toast.success = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'default',
    title: "Success",
    description: message,
    priority: 'medium',
    category: 'system',
    ...options,
  })
}

toast.error = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'destructive',
    title: "Error",
    description: message,
    priority: 'high',
    category: 'system',
    ...options,
  })
}

toast.warning = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'default',
    title: "Warning",
    description: message,
    priority: 'medium',
    category: 'system',
    ...options,
  })
}

toast.info = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'default',
    title: "Information",
    description: message,
    priority: 'low',
    category: 'system',
    ...options,
  })
}

toast.order = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'default',
    title: "Order Update",
    description: message,
    priority: 'critical',
    category: 'order',
    ...options,
  })
}

toast.payment = (message: string, options?: Partial<ToastParams>) => {
  return toast({
    variant: 'default',
    title: "Payment Update",
    description: message,
    priority: 'critical',
    category: 'payment',
    ...options,
  })
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
