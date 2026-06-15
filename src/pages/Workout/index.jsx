import { useState } from 'react'
import HomeDashboard from './HomeDashboard'
import ExerciseList from './ExerciseList'
import ActiveWorkout from './ActiveWorkout'

// sub-screens within the Workout tab
export default function WorkoutTab({ onProfile }) {
  const [view, setView]           = useState('home')      // 'home' | 'list' | 'active'
  const [selectedDay, setDay]     = useState(null)
  const [activeExIdx, setExIdx]   = useState(0)

  const openDay = (day) => { setDay(day); setView('list') }
  const startWorkout = () => { setExIdx(0); setView('active') }
  const goHome = () => setView('home')
  const nextEx = (idx) => {
    if (idx < selectedDay.exercises.length - 1) setExIdx(idx + 1)
    else goHome()
  }

  if (view === 'list') {
    return (
      <ExerciseList
        day={selectedDay}
        onBack={goHome}
        onStart={startWorkout}
      />
    )
  }

  if (view === 'active') {
    return (
      <ActiveWorkout
        day={selectedDay}
        exIdx={activeExIdx}
        onBack={() => setView('list')}
        onNext={() => nextEx(activeExIdx)}
        onChangeEx={setExIdx}
      />
    )
  }

  return <HomeDashboard onOpenDay={openDay} onProfile={onProfile} />
}
