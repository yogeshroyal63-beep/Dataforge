/**
 * A figure-style panel: white surface, hairline border, optional caption.
 * Used instead of the generic rounded-card-with-shadow pattern -- this app
 * is styled like a technical report, where content sits in labeled
 * figures, not floating cards.
 */
export default function Panel({ title, caption, badge, children, className = '' }) {
  return (
    <div className={`panel p-5 sm:p-6 ${className}`}>
      {(title || badge) && (
        <div className="flex items-start justify-between gap-3 mb-3">
          {title && <h3 className="font-serif text-lg text-ink">{title}</h3>}
          {badge}
        </div>
      )}
      {children}
      {caption && <p className="fig-caption mt-3">{caption}</p>}
    </div>
  )
}
