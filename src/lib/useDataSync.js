import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import {
  loadOrCreateUser,
  saveProfile,
  saveProgram,
  loadLatestProgram,
  loadWorkoutHistory,
  loadBodyWeightLog,
} from './db'

export function useDataSync() {
  const initialized = useRef(false)

  const setUser    = useAppStore(s => s.setUser)
  const setProfile = useAppStore(s => s.setProfile)
  const setProgram = useAppStore(s => s.setProgram)
  const setHistory = useAppStore(s => s.setWorkoutHistory)
  const setWeightLog = useAppStore(s => s.setBodyWeightLog)
  const setCycleDay  = useAppStore(s => s.setCurrentCycleDay)
  const setScreen    = useAppStore(s => s.setScreen)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function init() {
      try {
        const user = await loadOrCreateUser()
        if (!user) return

        setUser(user)
        setProfile({
          name:        user.name,
          age:         user.age,
          sex:         user.sex,
          weight:      user.weight,
          height:      user.height,
          goal:        user.goal,
          level:       user.level,
          daysPerWeek: user.days_per_week,
          goalWeight:  user.goal_weight,
        })

        const [program, history, weightLog] = await Promise.all([
          loadLatestProgram(),
          loadWorkoutHistory(),
          loadBodyWeightLog(),
        ])

        if (history?.length)   setHistory(history)
        if (weightLog?.length) setWeightLog(weightLog)

        if (program) {
          // Resume from where they left off (history length mod program days)
          const cycleDay = history?.length ?? 0
          setProgram(program)
          setCycleDay(cycleDay)
          setScreen('main')
        }
        // If no program — stay on onboarding so user creates one
      } catch (err) {
        console.error('Data sync init error:', err)
      }
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export async function persistProfile(profile) {
  try {
    await saveProfile(profile)
  } catch (err) {
    console.error('persistProfile error:', err)
  }
}

export async function persistProgram(program) {
  try {
    return await saveProgram(program)
  } catch (err) {
    console.error('persistProgram error:', err)
    return null
  }
}
