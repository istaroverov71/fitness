import { create } from 'zustand'

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
  // program shape: { id, name, goal, weeks: [ { days: [ { name, exercises: [...] } ] } ] }
  currentCycleDay: 0, // which day in the infinite cycle we're on

  // Active workout session
  activeWorkout: null, // { day, startTime }
  workoutLogs: {},     // exerciseId -> [{ weight, reps, timestamp }]

  // Completed workouts history
  workoutHistory: [],

  // Body weight log
  bodyWeightLog: [], // [{ weight, date }]

  // Actions
  setScreen: (screen) => set({ screen }),
  setTab: (tab) => set({ tab }),
  setUser: (user) => set({ user }),

  setProfile: (profile) => set({ profile }),

  setProgram: (program) => set({ program, currentCycleDay: 0 }),

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

  finishWorkout: () => {
    const state = get()
    const session = {
      id: Date.now(),
      day: state.activeWorkout.day,
      startTime: state.activeWorkout.startTime,
      endTime: Date.now(),
      logs: state.workoutLogs,
      cycleDay: state.currentCycleDay,
    }
    set({
      activeWorkout: null,
      workoutLogs: {},
      currentCycleDay: state.currentCycleDay + 1,
      workoutHistory: [session, ...state.workoutHistory],
    })
    return session
  },

  addBodyWeight: (weight) => set((state) => ({
    bodyWeightLog: [
      { weight, date: new Date().toISOString() },
      ...state.bodyWeightLog,
    ],
  })),
}))
