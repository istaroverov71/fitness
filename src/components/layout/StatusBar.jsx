// Fake iOS-style status bar
export default function StatusBar() {
  const time = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      height: 44,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: '0.02em',
      zIndex: 30,
    }}>
      <span>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="4.5" y="4" width="3" height="8" rx="1" />
          <rect x="9" y="2" width="3" height="10" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 4.5a9.5 9.5 0 0 1 14 0" />
          <path d="M3.5 7a6 6 0 0 1 9 0" />
          <path d="M6 9.5a2.5 2.5 0 0 1 4 0" />
          <circle cx="8" cy="11.5" r="0.8" fill="white" stroke="none" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white" />
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
