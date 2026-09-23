import MaterialIcon from "../ui/MaterialIcon"

function RoutineCard({
  time,
  title,
  description,
  icon,
  tag,
  active = false,
}) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <span
            className={`font-mono text-xs font-semibold ${
              active ? "text-primary" : "text-slate-500"
            }`}
          >
            {time}
          </span>

          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <MaterialIcon
          className={`text-[18px] ${
            active ? "text-primary" : "text-slate-400"
          }`}
        >
          {icon}
        </MaterialIcon>
      </div>

      {tag && (
        <span className="inline-block rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-mono text-slate-600">
          {tag}
        </span>
      )}
    </div>
  )
}

export default RoutineCard