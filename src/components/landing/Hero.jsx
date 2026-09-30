function TimelineItem({
  time,
  title,
  description,
  variant = "default",
  delay = 0,
}) {
  const styles = {
    default: {
      container: "bg-white border-slate-200 hover:border-slate-300",
      time: "text-slate-500",
      title: "text-slate-800",
    },

    anchor: {
      container: "bg-blue-50/60 border-blue-200 hover:border-blue-300",
      time: "text-primary",
      title: "text-slate-900",
    },

    flexible: {
      container: "bg-indigo-50/60 border-indigo-200 hover:border-indigo-300",
      time: "text-indigo-700",
      title: "text-slate-900",
    },

    sleep: {
      container: "bg-slate-100 border-slate-200 hover:border-slate-300",
      time: "text-slate-600",
      title: "text-slate-800",
    },
  }

  const currentStyle = styles[variant]

  return (
    <div
      className={`flex items-center rounded-lg border p-2.5 text-sm transition-colors timeline-item-in ${currentStyle.container}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`w-14 font-mono text-xs font-medium ${currentStyle.time}`}
      >
        {time}
      </span>

      <div
        className={`flex-1 font-medium ${currentStyle.title}`}
      >
        {title}

        {description && (
          <span className="ml-1 text-xs font-normal text-slate-500">
            ({description})
          </span>
        )}
      </div>
    </div>
  )
}

function TimelineColumn({ title, children }) {
  return (
    <div className="space-y-2.5">
      <div className="pl-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>

      {children}
    </div>
  )
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-slate-100 bg-white pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Heading */}
        <h1 className="fade-in-up mx-auto max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-dark sm:text-5xl md:text-6xl">
          Rencanakan harimu dengan lebih mudah.
        </h1>

        <p
          className="fade-in-up mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-500 sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          Atur rutinitas, pekerjaan, dan kegiatanmu dalam satu jadwal harian
          yang sesuai dengan waktumu.
        </p>

        {/* CTA */}
        <div
          className="fade-in-up mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
          style={{ animationDelay: "220ms" }}
        >
          <a
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            Mulai buat jadwal
          </a>
        </div>

        {/* Timeline Preview */}
        <div
          className="fade-in-up mx-auto mt-14 max-w-4xl text-left"
          style={{ animationDelay: "320ms" }}
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              </div>

            </div>

            {/* Timeline */}
            <div className="timeline-sheen relative bg-slate-50/40 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TimelineColumn>
                  <TimelineItem
                    time="06:00"
                    title="Bangun tidur"
                    delay={600}
                  />

                  <TimelineItem
                    time="06:30"
                    title="Rutinitas pagi"
                    delay={680}
                  />

                  <TimelineItem
                    time="07:00"
                    title="Sarapan"
                    delay={760}
                  />

                  <TimelineItem
                    time="08:00"
                    title="Kerja"
                    variant="anchor"
                    delay={840}
                  />

                  <TimelineItem
                    time="12:00"
                    title="Makan Siang & Sholat"
                    delay={920}
                  />

                  <TimelineItem
                    time="13:00"
                    title="Kerja"
                    variant="anchor"
                    delay={1000}
                  />
                </TimelineColumn>

                <TimelineColumn>
                  <TimelineItem
                    time="17:00"
                    title="Selesai kerja"
                    delay={1080}
                  />

                  <TimelineItem
                    time="18:00"
                    title="Olahraga"
                    variant="flexible"
                    delay={1160}
                  />

                  <TimelineItem
                    time="19:00"
                    title="Makan Malam & Sholat"
                    delay={1240}
                  />

                  <TimelineItem
                    time="20:00"
                    title="Belajar"
                    delay={1320}
                  />

                  <TimelineItem
                    time="21:00"
                    title="Waktu luang"
                    delay={1400}
                  />

                  <TimelineItem
                    time="22:30"
                    title="Tidur"
                    variant="sleep"
                    delay={1480}
                  />
                </TimelineColumn>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-2.5 text-xs text-slate-500">
              <span>Dailyflow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero