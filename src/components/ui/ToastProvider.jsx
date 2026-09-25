import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

import MaterialIcon from "./MaterialIcon"

const ToastContext = createContext(null)

const TYPE_CONFIG = {
  success: {
    icon: "check_circle",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    duration: 4000,
  },
  error: {
    icon: "error",
    className:
      "border-red-200 bg-red-50 text-red-700",
    duration: 6000,
  },
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    )
  }, [])

  const pushToast = useCallback(
    (type, message) => {
      const config =
        TYPE_CONFIG[type] || TYPE_CONFIG.success

      idRef.current += 1
      const id = idRef.current

      setToasts((current) => [
        ...current,
        { id, type, message },
      ])

      window.setTimeout(() => {
        dismissToast(id)
      }, config.duration)
    },
    [dismissToast]
  )

  const toast = useMemo(
    () => ({
      success: (message) =>
        pushToast("success", message),
      error: (message) =>
        pushToast("error", message),
    }),
    [pushToast]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div
        className="pointer-events-none fixed right-4 top-4 z-[110] flex w-[calc(100vw-2rem)] max-w-sm flex-col items-end gap-3 sm:right-6 sm:top-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const config =
            TYPE_CONFIG[item.type] ||
            TYPE_CONFIG.success

          return (
            <div
              key={item.id}
              className={`toast-in pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${config.className}`}
            >
              <MaterialIcon className="mt-0.5 text-[19px]">
                {config.icon}
              </MaterialIcon>

              <p className="flex-1 leading-5">
                {item.message}
              </p>

              <button
                type="button"
                onClick={() =>
                  dismissToast(item.id)
                }
                aria-label="Tutup notifikasi"
                className="-mr-1 shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
              >
                <MaterialIcon className="text-[18px]">
                  close
                </MaterialIcon>
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      "useToast harus digunakan di dalam ToastProvider."
    )
  }

  return context
}

export default ToastProvider
