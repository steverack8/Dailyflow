function LifestyleStep({ form, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Keseharianmu
        </h3>

        <p className="mt-1 text-sm text-muted">
          Atur rutinitas yang perlu dipertimbangkan saat menyusun harimu.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Bangun tidur
          </label>

          <input
            type="time"
            name="wakeTime"
            value={form.wakeTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Tidur
          </label>

          <input
            type="time"
            name="sleepTime"
            value={form.sleepTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Sarapan
          </label>

          <input
            type="time"
            name="breakfastTime"
            value={form.breakfastTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Makan siang
          </label>

          <input
            type="time"
            name="lunchTime"
            value={form.lunchTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Makan malam
          </label>

          <input
            type="time"
            name="dinnerTime"
            value={form.dinnerTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Frekuensi olahraga
          </label>

          <select
            name="exerciseFrequency"
            value={form.exerciseFrequency}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="0">Tidak berolahraga</option>
            <option value="1">1 hari / minggu</option>
            <option value="2">2 hari / minggu</option>
            <option value="3">3 hari / minggu</option>
            <option value="4">4 hari / minggu</option>
            <option value="5">5 hari / minggu</option>
            <option value="6">6 hari / minggu</option>
            <option value="7">Setiap hari</option>
          </select>
        </div>
      </div>

      {Number(form.exerciseFrequency) > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Durasi olahraga
          </label>

          <div className="relative">
            <input
              type="number"
              name="exerciseDuration"
              value={form.exerciseDuration}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-16 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
              mnt
            </span>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
        <div>
          <span className="block text-sm font-medium text-dark">
            Sertakan waktu ibadah
          </span>

          <span className="mt-1 block text-xs text-muted">
            Sisihkan waktu sholat dalam alur harianmu.
          </span>
        </div>

        <input
          type="checkbox"
          name="prayerEnabled"
          checked={form.prayerEnabled}
          onChange={onChange}
          className="h-4 w-4 accent-primary"
        />
      </label>
    </div>
  )
}

export default LifestyleStep