import { useState } from 'react'
import { useAppStore } from './store/appStore'
import { TabBar, Screen } from './components/layout'
import Onboarding from './pages/Onboarding'
import WorkoutTab from './pages/Workout'
import ExercisesTab from './pages/Exercises'
import AnalyticsTab from './pages/Analytics'
import Profile from './pages/Profile'

function MainApp() {
  const tab     = useAppStore(s => s.tab)
  const [showProfile, setShowProfile] = useState(false)

  if (showProfile) {
    return <Profile onClose={() => setShowProfile(false)} />
  }

  return (
    <Screen>
      {tab === 'workout'   && <WorkoutTab   onProfile={() => setShowProfile(true)} />}
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
