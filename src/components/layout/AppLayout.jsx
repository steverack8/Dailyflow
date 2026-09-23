import { Outlet } from "react-router-dom"
import AppNavbar from "../navigation/AppNavbar"

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-700">
      <AppNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-12 w-full border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <div>
            © 2024 DailyFlow. Precision Schedule Management.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="transition-colors hover:text-slate-900"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-slate-900"
            >
              Terms
            </a>

            <a
              href="#"
              className="transition-colors hover:text-slate-900"
            >
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout