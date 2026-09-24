import { useState } from "react"

import { useAuth } from "../../contexts/AuthContext"

export default function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin() {
    setLoading(true)
    setError("")

    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google login error:", error)

      setError(
        error?.message ||
          "Gagal masuk dengan Google."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
          />
          <path
            fill="#34A853"
            d="M12 21.99c2.63 0 4.84-.87 6.45-2.34l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.99Z"
          />
          <path
            fill="#FBBC05"
            d="M6.54 14.09A5.86 5.86 0 0 1 6.23 12c0-.72.12-1.42.31-2.09V7.38H3.29A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.62l3.25-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.88c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 2.93 14.63 2.01 12 2.01a9.74 9.74 0 0 0-8.71 5.37l3.25 2.53C7.31 7.6 9.46 5.88 12 5.88Z"
          />
        </svg>

        {loading
          ? "Menghubungkan..."
          : "Lanjutkan dengan Google"}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}