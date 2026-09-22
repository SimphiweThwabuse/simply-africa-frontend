const TONE_COLOR = {
  green: 'bg-health-green',
  amber: 'bg-health-amber',
  red: 'bg-health-red',
}

// score: 0-100. tone is derived automatically unless overridden.
export default function ProgressBar({ score, tone }) {
  const resolvedTone = tone || (score >= 80 ? 'green' : score >= 60 ? 'green' : score >= 40 ? 'amber' : 'red')

  return (
    <div className="flex min-w-0 max-w-[150px] items-center gap-2">
      <div className="h-1.5 flex-1 min-w-0 rounded-full bg-ink/10">
        <div
          className={`h-1.5 rounded-full ${TONE_COLOR[resolvedTone]}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-ink/60">{score}%</span>
    </div>
  )
}
