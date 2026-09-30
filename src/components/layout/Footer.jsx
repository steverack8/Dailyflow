import logo from "../../assets/logo.png"

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
           <span className="text-sm text-slate-500">
            © 2026 Dailyflow.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer