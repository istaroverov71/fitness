import { useAppStore } from './store/appStore'
import { StatusBar, TgHeader, TabBar, Screen, ScrollBody, Pad } from './components/layout'
import Onboarding from './pages/Onboarding'

// Placeholder main screens — replaced in later stages
function WorkoutTab() {
  return (
    <ScrollBody>
      <Pad>
        <div style={{ paddingTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💪</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Тренировка</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>Этап 5 — экраны тренировки</div>
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

function MainApp() {
  const tab = useAppStore(s => s.tab)
  const profile = useAppStore(s => s.profile)

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title={tab === 'workout' ? 'Тренировки' : tab === 'exercises' ? 'Упражнения' : 'Аналитика'}
        sub="FitBot"
        avatar={profile?.name?.[0]?.toUpperCase() ?? 'И'}
        onAvatar={() => {}}
      />
      {tab === 'workout'   && <WorkoutTab />}
      {tab === 'exercises' && <ExercisesTab />}
      {tab === 'analytics' && <AnalyticsTab />}
      <TabBar />
    </Screen>
  )
}

export default function App() {
  const screen = useAppStore(s => s.screen)

  if (screen === 'onboarding') return <Onboarding />
  return <MainApp />
}
