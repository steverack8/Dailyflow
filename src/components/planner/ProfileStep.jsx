import MaterialIcon from "../ui/MaterialIcon"

function ProfileStep({ form, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Ceritakan tentang dirimu
        </h3>
        <p className="mt-1 text-sm text-muted">
          Informasi ini membantu Dailyflow memahami konteks keseharianmu.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Usia
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={onChange}
            placeholder="mis. 25"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Jenis kelamin
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Tinggi badan
          </label>
          <div className="relative">
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={onChange}
              placeholder="mis. 170"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Berat badan
          </label>
          <div className="relative">
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={onChange}
              placeholder="mis. 65"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
              kg
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex gap-3">
          <MaterialIcon className="text-[20px] text-primary">
            info
          </MaterialIcon>

          <p className="text-sm leading-6 text-slate-600">
            Profilmu membantu Dailyflow membuat rutinitas yang lebih relevan.
            Detail ini tidak digunakan untuk memberikan rekomendasi medis.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileStep