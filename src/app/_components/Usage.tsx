export default function Usage({ title, steps, tips }: { title: string; steps: string[]; tips?: string[] }) {
  return (
    <div className="card" style={{ width: '100%' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <ol style={{ margin: 0, paddingLeft: 18 }}>
        {steps.map((s, i) => (
          <li key={i} style={{ margin: '6px 0' }}>{s}</li>
        ))}
      </ol>
      {tips && tips.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>小贴士：</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {tips.map((t, i) => (
              <li key={i} style={{ margin: '4px 0' }}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) as any;
}

