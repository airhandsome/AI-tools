export type Example = { title: string; text: string };

export default function Examples({ items, onUse }: { items: Example[], onUse: (t: string) => void }) {
  if (!items?.length) return null as any;
  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h4 style={{ marginTop: 0 }}>示例</h4>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {items.map((e) => (
          <button key={e.title} className="btn" onClick={() => onUse(e.text)} style={{ justifyContent: 'flex-start' }}>
            {e.title}
          </button>
        ))}
      </div>
    </div>
  ) as any;
}

