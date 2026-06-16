import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import HomeDashboard from './HomeDashboard'
import ExerciseList from './ExerciseList'
import ActiveWorkout from './ActiveWorkout'

export default function WorkoutTab({ onProfile }) {
  const storeStartWorkout = useAppStore(s => s.startWorkout)
  const activeWorkout     = useAppStore(s => s.activeWorkout)
  const workoutLogs       = useAppStore(s => s.workoutLogs)

  // If there's an active workout persisted, resume it immediately
  const resumeExIdx = () => {
    if (!activeWorkout) return 0
    const exercises = activeWorkout.day?.exercises ?? []
    for (let i = 0; i < exercises.length; i++) {
      const done = workoutLogs[exercises[i].id]?.length ?? 0
      if (done < (exercises[i].sets ?? 4)) return i
    }
    return Math.max(0, exercises.length - 1)
  }

  const [view, setView]         = useState(activeWorkout ? 'active' : 'home')
  const [selectedDay, setDay]   = useState(activeWorkout?.day ?? null)
  const [activeExIdx, setExIdx] = useState(resumeExIdx)

  const openDay = (day) => { setDay(day); setView('list') }

  const startWorkout = () => {
    storeStartWorkout(selectedDay)
    setExIdx(0)
    setView('active')
  }

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
        onDone={goHome}
      />
    )
  }

  return <HomeDashboard onOpenDay={openDay} onProfile={onProfile} />
}
