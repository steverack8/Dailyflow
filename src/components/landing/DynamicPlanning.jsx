import MaterialIcon from "../ui/MaterialIcon"

function DynamicPlanning() {
  return (
    <section className="border-b border-slate-100 bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark">
            Rencana berubah. Alurmu juga bisa.
          </h2>

          <p className="mt-3 text-base text-muted">
            DailyFlow dirancang untuk beradaptasi ketika harimu berubah,
            membantumu menata ulang aktivitas fleksibel tanpa mengganggu
            komitmen penting.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Scenario */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MaterialIcon className="text-[18px] text-amber-500">
                warning
              </MaterialIcon>

              Skenario Pemicu
            </div>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Pengguna melewatkan olahraga pukul 18:00
            </span>
          </div>

          {/* Notification */}
          <div className="my-5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3.5">
            <div className="flex items-center gap-2.5">
              <MaterialIcon className="text-[20px] text-primary">
                tune
              </MaterialIcon>

              <span className="text-xs font-medium text-blue-900 sm:text-sm">
                Malam harimu telah disesuaikan.
              </span>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Seimbang Otomatis
            </span>
          </div>

          {/* Updated Schedule */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Jadwal Sisa yang Diperbarui
            </span>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  18:00 – 19:00
                </span>

                <span className="font-medium text-slate-800">
                  Buffer & Waktu Istirahat
                </span>
              </div>

              <span className="text-slate-500">
                Istirahat diperluas
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  19:30 – 20:30
                </span>

                <span className="font-medium text-slate-800">
                  Membaca & Belajar
                </span>
              </div>

              <span className="text-primary">
                Dimajukan lebih awal
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  21:00 – 22:30
                </span>

                <span className="font-medium text-slate-800">
                  Waktu Pribadi
                </span>
              </div>

              <span className="text-emerald-600">
                Tetap utuh
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DynamicPlanning