import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext"

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff]">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="material-symbols-outlined animate-spin text-[20px]">
            progress_activity
          </span>

          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute