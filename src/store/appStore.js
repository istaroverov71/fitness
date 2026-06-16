import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { saveWorkoutSession, saveBodyWeight } from '../lib/db'

const STORAGE_KEY = 'fitbot_v1'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'onboarding',
      tab: 'workout',

      // User
      user: null,
      profile: null,

      // Program
      program: null,
      currentCycleDay: 0,

      // Active workout session (not persisted — cleared on restart)
      activeWorkout: null,
      workoutLogs: {},

      // History
      workoutHistory: [],
      bodyWeightLog: [],

      // ─── Setters ────────────────────────────────────────────────────────────────
      setScreen:          (screen)         => set({ screen }),
      setTab:             (tab)            => set({ tab }),
      setUser:            (user)           => set({ user }),
      setProfile:         (profile)        => set({ profile }),
      setWorkoutHistory:  (workoutHistory) => set({ workoutHistory }),
      setBodyWeightLog:   (bodyWeightLog)  => set({ bodyWeightLog }),
      setCurrentCycleDay: (currentCycleDay) => set({ currentCycleDay }),

      setProgram: (program) => set((state) => ({
        program,
        currentCycleDay: state.workoutHistory.length > 0 ? state.currentCycleDay : 0,
      })),

      // ─── Workout actions ──────────────────────────────────────────────────────
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

        set({
          activeWorkout: null,
          workoutLogs: {},
          currentCycleDay: state.currentCycleDay + 1,
          workoutHistory: [{ ...session, id: Date.now() }, ...state.workoutHistory],
        })

        try {
          await saveWorkoutSession(session, state.program?.id ?? null)
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
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist what matters — skip transient UI state
      partialize: (state) => ({
        screen:          state.screen,
        profile:         state.profile,
        program:         state.program,
        currentCycleDay: state.currentCycleDay,
        workoutHistory:  state.workoutHistory,
        bodyWeightLog:   state.bodyWeightLog,
      }),
    }
  )
)
