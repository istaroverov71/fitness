// Placeholder for exercise image/GIF
// Replace src prop with actual GIF URL when available

const GROUP_COLORS = {
  chest:     ['#FF3B30', '#FF6B35'],
  back:      ['#3DA5FF', '#1E78FF'],
  legs:      ['#A06BFF', '#7B3FE4'],
  shoulders: ['#FF9500', '#FF6B00'],
  biceps:    ['#00C9A7', '#00A68A'],
  triceps:   ['#FF2D78', '#E0005E'],
  abs:       ['#00E676', '#00B85C'],
  cardio:    ['#FF3B30', '#FF9500'],
}

export default function ExerciseImage({ src, muscleGroup, alt, style, radius = 16 }) {
  const [err, setErr] = useState(false)
  const colors = GROUP_COLORS[muscleGroup] || ['#3A3A3A', '#2A2A2A']

  if (src && !err) {
    return (
      <img
        src={src}
        alt={alt || ''}
        onError={() => setErr(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: radius,
          display: 'block',
          ...style,
        }}
      />
    )
  }

  // Gradient placeholder when no GIF available
  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: radius,
      background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}44)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors[0]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
        <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h3v5H3zM18 9.5h3v5h-3zM6.5 12h11" />
      </svg>
    </div>
  )
}

import { useState } from 'react'
