// Semantic color mapping - matches the health_status / stage / status enums in the schema
const TONES = {
  green: 'bg-health-green/10 text-health-green',
  amber: 'bg-health-amber/10 text-health-amber',
  red: 'bg-health-red/10 text-health-red',
  blue: 'bg-accent/10 text-accent',
  purple: 'bg-health-green/10 text-health-green',
  neutral: 'bg-ink/5 text-ink/60',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
