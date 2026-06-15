import Icon from '../ui/Icon'
import { haptic } from '../../lib/telegram'

export default function TgHeader({
  title,
  sub,
  back,        // label for back button, e.g. "Назад"
  onBack,
  avatar,      // single letter for avatar circle
  onAvatar,
  right,       // right-side element
}) {
  return (
    <div style={{
      height: 48,
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 12px',
      background: 'var(--bg)',
      zIndex: 20,
    }}>

      {/* Left: back button or avatar */}
      {back !== undefined && (
        <button
          onClick={() => { haptic('light'); onBack?.() }}
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontFamily: 'inherit',
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 8px',
          }}
        >
          <Icon d="chev" size={18} color="var(--accent)" style={{ transform: 'rotate(180deg)' }} />
          {back && <span>{back}</span>}
        </button>
      )}

      {avatar && (
        <button
          onClick={() => { haptic('light'); onAvatar?.() }}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(145deg, var(--accent), var(--accent2))',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px -4px rgba(255,59,48,0.7)',
          }}
        >
          {avatar}
        </button>
      )}

      {/* Center: title + subtitle */}
      {title && (
        <div style={{ textAlign: 'center', lineHeight: 1.05 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500, marginTop: 1 }}>{sub}</div>}
        </div>
      )}

      {/* Right: optional action */}
      {right && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {right}
        </div>
      )}
    </div>
  )
}
