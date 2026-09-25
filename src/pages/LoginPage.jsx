import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import GoogleLoginButton from "../components/auth/GoogleLoginButton"
import Skeleton from "../components/ui/Skeleton"
import logo from "../assets/logo.png"
import { useAuth } from "../contexts/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [user, loading, navigate])

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-6">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-6 w-2/3" />
          <Skeleton className="mx-auto h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 py-8 sm:px-6">
      <main className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-10">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-7 flex h-20 w-20 items-center justify-center">
            <img
              src={logo}
              alt="DailyFlow"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30]">
              Selamat Datang di DailyFlow
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#565e74]">
              Rencanakan harimu, kelola waktumu, dan tetap di jalur yang tepat.
            </p>
          </div>

          {/* Login */}
          <div className="mt-8 w-full">
            <GoogleLoginButton />
          </div>

          {/* Security */}
          <p className="mt-4 text-center text-xs leading-5 text-[#737686]">
            Masuk dengan aman menggunakan akun Google Anda.
          </p>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 text-sm font-medium text-[#565e74] transition-colors hover:text-[#0b1c30]"
          >
            Kembali ke beranda
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-[#737686]">
            DailyFlow · Perencanaan Pribadi Anda
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginPage