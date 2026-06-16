import { create } from 'zustand'
import { saveWorkoutSession, saveBodyWeight } from '../lib/db'

export const useAppStore = create((set, get) => ({
  // Navigation
  screen: 'onboarding', // 'onboarding' | 'main'
  tab: 'workout',       // 'workout' | 'exercises' | 'analytics'

  // User
  user: null,
  profile: null,
  // profile shape: { name, age, sex, weight, height, goal, level, daysPerWeek, goalWeight }

  // Program (AI-generated)
  program: null,
  currentCycleDay: 0,

  // Active workout session
  activeWorkout: null, // { day, startTime }
  workoutLogs: {},     // exerciseId -> [{ weight, reps, timestamp }]

  // Completed workouts history
  workoutHistory: [],

  // Body weight log
  bodyWeightLog: [],

  // ─── Setters (used by useDataSync to hydrate from Supabase) ──────────────────
  setScreen:       (screen)  => set({ screen }),
  setTab:          (tab)     => set({ tab }),
  setUser:         (user)    => set({ user }),
  setProfile:      (profile) => set({ profile }),
  setWorkoutHistory: (workoutHistory) => set({ workoutHistory }),
  setBodyWeightLog:  (bodyWeightLog)  => set({ bodyWeightLog }),
  setCurrentCycleDay: (currentCycleDay) => set({ currentCycleDay }),

  setProgram: (program) => set((state) => ({
    program,
    // Only reset cycleDay when creating a new program (no existing history)
    currentCycleDay: state.workoutHistory.length > 0 ? state.currentCycleDay : 0,
  })),

  // ─── Workout actions ──────────────────────────────────────────────────────────
  startWorkout: (day) => set({
    activeWorkout: { day, startTime: Date.now() },
    workoutLogs: {},
  }),

  logSet: (exerciseId, setData) => set((state) => ({
    workoutLogs: {
      ...state.workoutLogs,
      [exerciseId]: [...(state.workoutLogs[exerciseId] || []), setData],
    },
  })),

  finishWorkout: async () => {
    const state = get()
    const session = {
      day:       state.activeWorkout.day,
      startTime: state.activeWorkout.startTime,
      endTime:   Date.now(),
      logs:      state.workoutLogs,
      cycleDay:  state.currentCycleDay,
    }

    const newCycleDay = state.currentCycleDay + 1

    set({
      activeWorkout: null,
      workoutLogs: {},
      currentCycleDay: newCycleDay,
      workoutHistory: [{ ...session, id: Date.now() }, ...state.workoutHistory],
    })

    // Persist to Supabase in background
    try {
      const programId = state.program?.id ?? null
      await saveWorkoutSession(session, programId)
    } catch (err) {
      console.error('finishWorkout persist error:', err)
    }

    return session
  },

  addBodyWeight: async (weight) => {
    set((state) => ({
      bodyWeightLog: [
        { weight, date: new Date().toISOString() },
        ...state.bodyWeightLog,
      ],
    }))

    try {
      await saveBodyWeight(weight)
    } catch (err) {
      console.error('addBodyWeight persist error:', err)
    }
  },
}))
