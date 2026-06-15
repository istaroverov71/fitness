// Scrollable horizontal pill tabs
export default function PillTabs({ tabs, active, onPick }) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '2px 0 4px',
      scrollbarWidth: 'none',
      marginBottom: 4,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onPick(tab)}
          style={{
            flexShrink: 0,
            height: 38,
            padding: '0 18px',
            borderRadius: 11,
            border: 'none',
            background: active === tab ? 'var(--accent)' : 'var(--elev)',
            color: active === tab ? '#fff' : 'var(--text2)',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: '0.16s',
            whiteSpace: 'nowrap',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
