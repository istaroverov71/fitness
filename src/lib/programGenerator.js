// Local program generator — creates Push/Pull/Legs split based on user profile.
// In Этап 10 this will be replaced by Gemini AI API call.

import { EXERCISES } from './exercises'

const SPLITS = {
  3: [
    { name: 'Грудь + Трицепс',    groups: ['chest', 'triceps'] },
    { name: 'Спина + Бицепс',     groups: ['back', 'biceps'] },
    { name: 'Ноги + Плечи',       groups: ['legs', 'shoulders'] },
  ],
  4: [
    { name: 'Грудь + Трицепс',    groups: ['chest', 'triceps'] },
    { name: 'Спина + Бицепс',     groups: ['back', 'biceps'] },
    { name: 'Ноги',               groups: ['legs'] },
    { name: 'Плечи + Руки',       groups: ['shoulders', 'biceps', 'triceps'] },
  ],
  5: [
    { name: 'Грудь',              groups: ['chest'] },
    { name: 'Спина',              groups: ['back'] },
    { name: 'Ноги',               groups: ['legs'] },
    { name: 'Плечи + Трицепс',   groups: ['shoulders', 'triceps'] },
    { name: 'Руки + Пресс',      groups: ['biceps', 'abs'] },
  ],
  6: [
    { name: 'Грудь + Трицепс',    groups: ['chest', 'triceps'] },
    { name: 'Спина + Бицепс',     groups: ['back', 'biceps'] },
    { name: 'Ноги',               groups: ['legs'] },
    { name: 'Плечи',              groups: ['shoulders'] },
    { name: 'Грудь (силовая)',    groups: ['chest', 'abs'] },
    { name: 'Спина + Руки',       groups: ['back', 'biceps', 'triceps'] },
  ],
}

function pickExercises(groups, level) {
  const MAX_PER_GROUP = level === 'beginner' ? 2 : level === 'amateur' ? 3 : 4
  const result = []

  // Add warmup cardio at start (for mass gain: light, for cut: moderate)
  const cardio = EXERCISES.find(e => e.muscleGroup === 'cardio')
  if (cardio) {
    result.push({
      ...cardio,
      sets: 1,
      reps: '5 мин',
      note: 'Разминка',
    })
  }

  for (const group of groups) {
    const pool = EXERCISES.filter(e => e.muscleGroup === group)
    const count = Math.min(MAX_PER_GROUP, pool.length)
    // Pick first N (in real app Gemini selects based on profile)
    for (let i = 0; i < count; i++) {
      result.push(pool[i])
    }
  }

  return result
}

function adjustSetsReps(exercise, goal, level) {
  if (goal === 'mass') {
    return {
      sets: exercise.sets,
      reps: level === 'pro' ? '6–8' : '8–12',
      restSeconds: 90,
    }
  } else {
    return {
      sets: exercise.sets,
      reps: '12–15',
      restSeconds: 60,
    }
  }
}

export async function generateProgram(profile) {
  const { goal = 'mass', level = 'amateur', daysPerWeek = 4, name = 'Атлет', weight = 80 } = profile || {}

  // Clamp days to available splits
  const days = Math.min(Math.max(daysPerWeek, 3), 6)
  const splitTemplate = SPLITS[days] || SPLITS[4]

  const programDays = splitTemplate.map((template, idx) => {
    const exercises = pickExercises(template.groups, level).map(ex => ({
      ...ex,
      ...adjustSetsReps(ex, goal, level),
    }))

    return {
      id: idx + 1,
      name: template.name,
      groups: template.groups,
      exercises,
    }
  })

  const goalName = goal === 'mass' ? 'Набор массы' : 'Похудение'
  const levelName = { beginner: 'Новичок', amateur: 'Любитель', pro: 'Опытный' }[level]

  return {
    id: Date.now(),
    name: `${goalName} · ${levelName}`,
    goal,
    level,
    daysPerWeek: days,
    createdAt: new Date().toISOString(),
    days: programDays,
    // Infinite cycling — we rotate through days endlessly
    totalDays: programDays.length,
  }
}
