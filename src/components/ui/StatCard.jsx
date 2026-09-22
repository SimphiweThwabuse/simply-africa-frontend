export default function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-lg border border-line bg-white px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`mt-1 text-3xl font-serif ${accent ? 'text-accent' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  )
}
