import MaterialIcon from "../ui/MaterialIcon"

const dimensions = [
  {
    icon: "laptop_mac",
    title: "Work",
    description: "Deep & collaborative",
  },
  {
    icon: "bedtime",
    title: "Sleep",
    description: "Non-negotiable rest",
  },
  {
    icon: "fitness_center",
    title: "Exercise",
    description: "Cardio, gym, walking",
  },
  {
    icon: "restaurant",
    title: "Meals",
    description: "Mindful nourishment",
  },
  {
    icon: "self_improvement",
    title: "Prayer",
    description: "Spiritual anchors",
  },
  {
    icon: "menu_book",
    title: "Study",
    description: "Courses & reading",
  },
  {
    icon: "palette",
    title: "Hobbies",
    description: "Creative recharge",
  },
  {
    icon: "spa",
    title: "Personal time",
    description: "Family & wind down",
  },
]

function LifeDimensions() {
  return (
    <section
      id="features"
      className="border-b border-slate-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark">
            Your day is more than a to-do list.
          </h2>

          <p className="mt-3 text-base text-muted">
            DailyFlow considers the different dimensions of everyday life
            rather than treating your day like an endless task list.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {dimensions.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-slate-300"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <MaterialIcon className="text-[20px]">
                  {item.icon}
                </MaterialIcon>
              </div>

              <span className="text-sm font-medium text-dark">
                {item.title}
              </span>

              <span className="mt-0.5 text-xs text-slate-500">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LifeDimensions