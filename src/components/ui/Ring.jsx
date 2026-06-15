// Circular progress ring — used for workout completion %
export default function Ring({ value = 0, size = 44, children }) {
  const stroke = 3.5
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const progress = Math.min(Math.max(value, 0), 100)
  const filled = (progress / 100) * C

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--elev)"
          strokeWidth={stroke}
        />
        {/* fill */}
        {progress > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={progress >= 100 ? 'var(--success)' : 'var(--accent)'}
            strokeWidth={stroke}
            strokeDasharray={`${filled} ${C - filled}`}
            strokeLinecap="round"
          />
        )}
      </svg>
      {/* center content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        fontSize: size * 0.28,
        fontWeight: 700,
        color: progress >= 100 ? 'var(--success)' : progress > 0 ? 'var(--accent)' : 'var(--text2)',
      }}>
        {children ?? (progress > 0 ? `${Math.round(progress)}` : '')}
      </div>
    </div>
  )
}
