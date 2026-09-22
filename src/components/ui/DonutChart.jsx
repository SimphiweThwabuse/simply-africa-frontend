import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// data: [{ name, value, color }]
// centerLabel/centerValue render inside the donut hole
export default function DonutChart({ data, centerLabel, centerValue }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-5">
      <div className="relative h-44 w-44 shrink-0 sm:h-52 sm:w-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-serif leading-none text-ink/80">{centerValue}</span>
          <span className="mt-1 text-xs text-ink/50">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full max-w-[360px] space-y-2 text-sm">
        {data.map((entry) => (
          <li key={entry.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="min-w-0 text-ink/70">{entry.name}</span>
            <span className="whitespace-nowrap text-right text-ink/60">
              <span className="font-medium">{entry.value}</span>
              <span className="ml-1 text-ink/50">({entry.pct}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
