// Full-height screen wrapper with flex column layout
export default function Screen({ children, style }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

// Scrollable body area inside a screen
export function ScrollBody({ children, style }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  )
}

// Standard 16px padding wrapper
export function Pad({ children, style }) {
  return (
    <div style={{ padding: 'var(--pad)', ...style }}>
      {children}
    </div>
  )
}
