import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext"
import Skeleton from "../ui/Skeleton"

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-8">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-32 md:block" />
              <Skeleton className="hidden h-4 w-36 md:block" />
            </div>

            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-64" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>

          <Skeleton className="mt-6 h-64" />
        </main>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute