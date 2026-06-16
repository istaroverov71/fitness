import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import HomeDashboard from './HomeDashboard'
import ExerciseList from './ExerciseList'
import ActiveWorkout from './ActiveWorkout'

export default function WorkoutTab({ onProfile }) {
  const storeStartWorkout = useAppStore(s => s.startWorkout)

  const [view, setView]         = useState('home')
  const [selectedDay, setDay]   = useState(null)
  const [activeExIdx, setExIdx] = useState(0)

  const openDay = (day) => { setDay(day); setView('list') }

  const startWorkout = () => {
    storeStartWorkout(selectedDay)   // ← records startTime in store
    setExIdx(0)
    setView('active')
  }

  const goHome  = () => setView('home')
  const nextEx  = (idx) => {
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
        onDone={goHome}
      />
    )
  }

  return <HomeDashboard onOpenDay={openDay} onProfile={onProfile} />
}
