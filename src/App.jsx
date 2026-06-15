import { useAppStore } from './store/appStore'

export default function App() {
  const screen = useAppStore(s => s.screen)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>💪</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>FitBot</div>
      <div style={{ fontSize: 14, color: 'var(--text2)' }}>Этап 1 готов — базовый фундамент</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>
        screen: <b style={{ color: 'var(--text)' }}>{screen}</b>
      </div>
    </div>
  )
}
