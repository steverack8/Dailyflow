import MaterialIcon from "../ui/MaterialIcon"

function ProfileStep({ form, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Tell us about yourself
        </h3>
        <p className="mt-1 text-sm text-muted">
          This information helps Dailyflow understand your daily context.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={onChange}
            placeholder="e.g. 25"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Height
          </label>
          <div className="relative">
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={onChange}
              placeholder="e.g. 170"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Weight
          </label>
          <div className="relative">
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={onChange}
              placeholder="e.g. 65"
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
            Your profile helps Dailyflow create a more relevant routine.
            These details are not used to make medical recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileStep