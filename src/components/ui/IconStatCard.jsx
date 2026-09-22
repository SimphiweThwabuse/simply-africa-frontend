// Tint/icon-color pairs - pass tone to match the metric's meaning
const TONES = {
  blue: { bg: 'bg-tint-blue', icon: 'text-accent' },
  green: { bg: 'bg-tint-green', icon: 'text-health-green' },
  purple: { bg: 'bg-tint-purple', icon: 'text-health-green' },
  amber: { bg: 'bg-tint-amber', icon: 'text-health-amber' },
}

export default function IconStatCard({ icon: Icon, label, value, change, tone = 'blue' }) {
  const t = TONES[tone]
  const trendUp = change?.startsWith('+') ?? true

  return (
    <div className={`rounded-xl ${t.bg} p-5`}>
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white ${t.icon}`}>
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <p className="text-sm text-ink/60">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-serif">{value}</span>
        {change && (
          <span className={`text-xs font-medium ${trendUp ? 'text-health-green' : 'text-health-red'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-xs text-ink/40">vs. last quarter</p>
    </div>
  )
}
