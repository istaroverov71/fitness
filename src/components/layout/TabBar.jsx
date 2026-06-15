import Icon from '../ui/Icon'
import { useAppStore } from '../../store/appStore'
import { haptic } from '../../lib/telegram'

const TABS = [
  { id: 'workout',   label: 'Тренировка', icon: 'dumbbell' },
  { id: 'exercises', label: 'Упражнения', icon: 'search' },
  { id: 'analytics', label: 'Аналитика',  icon: 'chart' },
]

export default function TabBar() {
  const tab = useAppStore(s => s.tab)
  const setTab = useAppStore(s => s.setTab)

  return (
    <div style={{
      height: 74,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '9px 6px 0',
      borderTop: '1px solid var(--divider)',
      background: 'rgba(13,13,13,0.92)',
      backdropFilter: 'blur(14px)',
      zIndex: 20,
    }}>
      {TABS.map(t => {
        const active = tab === t.id
        return (
          <button
            key={t.id}
            onClick={() => { haptic('light'); setTab(t.id) }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: active ? 'var(--accent)' : 'var(--text2)',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.16s',
            }}
          >
            <Icon d={t.icon} size={22} color={active ? 'var(--accent)' : 'var(--text2)'} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.01em' }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
