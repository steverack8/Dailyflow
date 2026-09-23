import logo from "../../assets/logo.png"

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Dailyflow"
            className="h-6 w-6 object-contain"
          />

          <span className="text-sm text-slate-500">
            © 2026 Dailyflow. Personal routine & time planning.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <a
            href="#features"
            className="transition-colors hover:text-dark"
          >
            Product
          </a>

          <a
            href="#how-it-works"
            className="transition-colors hover:text-dark"
          >
            How it works
          </a>

          <a
            href="#features"
            className="transition-colors hover:text-dark"
          >
            Features
          </a>

          <a
            href="#"
            className="transition-colors hover:text-dark"
          >
            Privacy
          </a>

          <a
            href="#"
            className="transition-colors hover:text-dark"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer