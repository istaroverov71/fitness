// ─── Area (line) chart ────────────────────────────────────────────────────────
export function AreaChart({ values, color = 'var(--accent)', height = 140 }) {
  if (!values || values.length < 2) return null
  const W = 326, H = height
  const max = Math.max(...values) * 1.12
  const min = Math.min(...values) * 0.9
  const pad = 6
  const X = (i) => pad + (i * (W - 2 * pad)) / (values.length - 1)
  const Y = (v) => H - 10 - ((v - min) / (max - min)) * (H - 26)
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${X(values.length - 1)},${H} L${X(0)},${H} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={X(i)}
          cy={Y(v)}
          r={i === values.length - 1 ? 5 : 3}
          fill={i === values.length - 1 ? color : 'var(--card)'}
          stroke={color}
          strokeWidth="2.5"
        />
      ))}
    </svg>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
export function BarChart({ bars }) {
  if (!bars || bars.length === 0) return null
  const W = 326, H = 150
  const max = Math.max(...bars.map((b) => b.v)) * 1.1
  const bw = 30
  const gap = (W - bars.length * bw) / (bars.length + 1)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {bars.map((b, i) => {
        const bh = (b.v / max) * (H - 22)
        const x = gap + i * (bw + gap)
        const y = H - 18 - bh
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={bw} height={bh} rx="7"
              fill={b.hot ? 'var(--accent)' : 'var(--elev)'}
            />
            <text
              x={x + bw / 2} y={H - 4}
              textAnchor="middle" fontSize="11" fontWeight="600"
              fill="var(--text2)" fontFamily="Inter"
            >
              {b.l}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
export function Donut({ data, size = 150, strokeWidth = 22 }) {
  if (!data || data.length === 0) return null
  const r = (size - strokeWidth) / 2
  const C = 2 * Math.PI * r
  const total = data.reduce((a, d) => a + d.value, 0)
  let acc = 0

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--elev)" strokeWidth={strokeWidth} />
        {data.map((d, i) => {
          const len = (d.value / total) * C
          const el = (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-acc}
            />
          )
          acc += len
          return el
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center', textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginTop: 3 }}>подходов</div>
        </div>
      </div>
    </div>
  )
}
