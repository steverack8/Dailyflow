import MaterialIcon from "../ui/MaterialIcon"

const steps = [
  {
    number: "01",
    icon: "edit_note",
    title: "Tell us about your routine",
    description:
      "Add your work, sleep, activities, priorities, and personal preferences.",
    footer: "Takes less than 2 minutes",
  },
  {
    number: "02",
    icon: "auto_awesome",
    title: "Let DailyFlow plan",
    description:
      "DailyFlow organizes your available time and creates a balanced daily flow around your commitments.",
    footer: "Designed around your schedule",
  },
  {
    number: "03",
    icon: "calendar_today",
    title: "Flow through your day",
    description:
      "Follow your plan, adjust activities when needed, and optionally sync your schedule to Google Calendar.",
    footer: "Ready to adapt",
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-slate-100 bg-slate-50/50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark">
            A better way to plan your day.
          </h2>

          <p className="mt-3 text-base text-muted">
            Understand your routine, organize your available hours, and
            establish a rhythm you can actually maintain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-primary">
                    <MaterialIcon className="text-[20px]">
                      {step.icon}
                    </MaterialIcon>
                  </div>

                  <span className="font-mono text-xs font-semibold text-slate-400">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-semibold text-dark">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                {step.footer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks