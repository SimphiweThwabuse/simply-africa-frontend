export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white px-8 py-14 text-center">
      <h3 className="font-serif text-lg">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
