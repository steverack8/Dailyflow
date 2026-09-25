import { useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"

import logo from "../../assets/logo.png"
import MaterialIcon from "../ui/MaterialIcon"
import { useToast } from "../ui/ToastProvider"
import { useAuth } from "../../contexts/AuthContext"

const navItems = [
  {
    label: "Dasbor & Rencana",
    to: "/dashboard",
  },
  {
    label: "Analisis Aktivitas",
    to: "/activity-analysis",
  },
  {
    label: "Ekspor & Sinkronisasi",
    to: "/export-sync",
  },
]

function AppNavbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await logout()
      navigate("/", { replace: true })
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Gagal keluar. Silakan coba lagi.")
      setIsLoggingOut(false)
    }
  }

  const userEmail = user?.email || ""
  const userName = user?.displayName || "Pengguna"
  const userPhoto = user?.photoURL

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-8">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2.5"
          >
            <img
              src={logo}
              alt="DailyFlow Logo"
              className="h-8 w-auto object-contain"
            />

            <span className="text-base font-bold tracking-tight text-slate-900">
              DailyFlow
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-3">
          {/* User Information */}
          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-medium leading-5 text-slate-900">
              {userName}
            </p>

            <p className="max-w-[180px] truncate text-xs leading-4 text-slate-500">
              {userEmail}
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 transition-colors hover:bg-slate-200"
              aria-label="Menu pengguna"
              aria-expanded={isMenuOpen}
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <MaterialIcon className="text-[19px] text-slate-600">
                  person
                </MaterialIcon>
              )}
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.10)]">
                {/* Account */}
                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt={userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MaterialIcon className="text-[19px] text-slate-600">
                          person
                        </MaterialIcon>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MaterialIcon className="text-[19px]">
                      logout
                    </MaterialIcon>

                    <span>
                      {isLoggingOut
                        ? "Keluar..."
                        : "Keluar"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar