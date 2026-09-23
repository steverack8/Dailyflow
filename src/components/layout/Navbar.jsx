import logo from "../../assets/logo.png"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#"
          className="group flex items-center gap-2.5"
          aria-label="Dailyflow home"
        >
          <img
            src={logo}
            alt="Dailyflow"
            className="h-8 w-8 object-contain"
          />

          <span className="text-[17px] font-semibold tracking-tight text-dark">
            Dailyflow
          </span>
        </a>
        <a
          // href="#get-started"
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Get started
        </a>
      </div>
    </header>
  )
}

export default Navbar