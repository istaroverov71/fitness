import { useState } from 'react'
import MuscleGroups from './MuscleGroups'
import GroupExercises from './GroupExercises'
import ExerciseDetail from './ExerciseDetail'

export default function ExercisesTab() {
  const [view,     setView]     = useState('groups') // 'groups' | 'list' | 'detail'
  const [groupId,  setGroupId]  = useState(null)
  const [exercise, setExercise] = useState(null)

  if (view === 'list') {
    return (
      <GroupExercises
        groupId={groupId}
        onBack={() => setView('groups')}
        onPick={(ex) => { setExercise(ex); setView('detail') }}
      />
    )
  }

  if (view === 'detail') {
    return (
      <ExerciseDetail
        exercise={exercise}
        onBack={() => setView('list')}
      />
    )
  }

  return (
    <MuscleGroups
      onPick={(id) => { setGroupId(id); setView('list') }}
    />
  )
}
