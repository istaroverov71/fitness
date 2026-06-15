import { useAppStore } from './store/appStore'
import { StatusBar, TgHeader, TabBar, Screen, ScrollBody, Pad } from './components/layout'
import { Icon } from './components/ui'

// Placeholder screens — будут заменены на реальные в следующих этапах
function WorkoutTab() {
  return (
    <ScrollBody>
      <Pad>
        <div style={{ paddingTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💪</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Тренировка</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>Этап 4 — онбординг и программа</div>
        </div>
      </Pad>
    </ScrollBody>
  )
}

function ExercisesTab() {
  return (
    <ScrollBody>
      <Pad>
        <div style={{ paddingTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Упражнения</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>Этап 6 — каталог упражнений</div>
        </div>
      </Pad>
    </ScrollBody>
  )
}

function AnalyticsTab() {
  return (
    <ScrollBody>
      <Pad>
        <div style={{ paddingTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Аналитика</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>Этап 7 — графики и статистика</div>
        </div>
      </Pad>
    </ScrollBody>
  )
}

export default function App() {
  const tab = useAppStore(s => s.tab)

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title={tab === 'workout' ? 'Тренировки' : tab === 'exercises' ? 'Упражнения' : 'Аналитика'}
        sub="FitBot"
        avatar="И"
        onAvatar={() => alert('Профиль — Этап 8')}
      />

      {/* Tab content */}
      {tab === 'workout'   && <WorkoutTab />}
      {tab === 'exercises' && <ExercisesTab />}
      {tab === 'analytics' && <AnalyticsTab />}

      <TabBar />
    </Screen>
  )
}
