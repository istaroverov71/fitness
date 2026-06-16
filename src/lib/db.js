// Database service — all Supabase operations in one place
import { supabase } from './supabase'
import { getTelegramUser } from './telegram'

// Set RLS context so Supabase knows which user is making requests
async function setRLSContext(userId) {
  await supabase.rpc('set_config', {
    setting: 'app.telegram_id',
    value: String(userId),
    is_local: true,
  }).catch(() => {}) // ignore if function doesn't exist yet
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function loadOrCreateUser() {
  const tgUser = getTelegramUser()
  const userId = tgUser.id

  await setRLSContext(userId)

  // Try to load existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (existing) return existing

  // Create new user from Telegram data
  const { data: created, error } = await supabase
    .from('users')
    .insert({ id: userId, name: tgUser.first_name })
    .select()
    .single()

  if (error) console.error('Create user error:', error)
  return created
}

export async function saveProfile(profile) {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { error } = await supabase
    .from('users')
    .upsert({
      id:           tgUser.id,
      name:         profile.name,
      age:          profile.age,
      sex:          profile.sex,
      weight:       profile.weight,
      height:       profile.height,
      goal:         profile.goal,
      level:        profile.level,
      days_per_week: profile.daysPerWeek,
      goal_weight:  profile.goalWeight,
    })

  if (error) console.error('Save profile error:', error)
}

// ─── Program ──────────────────────────────────────────────────────────────────

export async function saveProgram(program) {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { data, error } = await supabase
    .from('programs')
    .insert({
      user_id:      tgUser.id,
      name:         program.name,
      goal:         program.goal,
      level:        program.level,
      days_per_week: program.daysPerWeek,
      days:         program.days,
    })
    .select()
    .single()

  if (error) console.error('Save program error:', error)
  return data
}

export async function loadLatestProgram() {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { data } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', tgUser.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null

  return {
    id:          data.id,
    name:        data.name,
    goal:        data.goal,
    level:       data.level,
    daysPerWeek: data.days_per_week,
    days:        data.days,
    createdAt:   data.created_at,
    totalDays:   data.days.length,
  }
}

// ─── Workout sessions ─────────────────────────────────────────────────────────

export async function saveWorkoutSession(session, programId) {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  // Insert session
  const { data: savedSession, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id:    tgUser.id,
      program_id: programId,
      day_name:   session.day?.name,
      day_groups: session.day?.groups ?? [],
      start_time: new Date(session.startTime).toISOString(),
      end_time:   new Date(session.endTime).toISOString(),
      cycle_day:  session.cycleDay,
    })
    .select()
    .single()

  if (sessionError) { console.error('Save session error:', sessionError); return null }

  // Insert all exercise logs
  const logRows = []
  Object.entries(session.logs || {}).forEach(([exerciseId, sets]) => {
    sets.forEach((set, idx) => {
      logRows.push({
        session_id:  savedSession.id,
        user_id:     tgUser.id,
        exercise_id: exerciseId,
        weight:      set.weight,
        reps:        set.reps,
        set_number:  idx + 1,
        logged_at:   new Date(set.timestamp).toISOString(),
      })
    })
  })

  if (logRows.length > 0) {
    const { error: logsError } = await supabase.from('exercise_logs').insert(logRows)
    if (logsError) console.error('Save logs error:', logsError)
  }

  return savedSession
}

export async function loadWorkoutHistory() {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select(`
      id, day_name, day_groups, start_time, end_time, cycle_day,
      exercise_logs ( exercise_id, weight, reps, set_number, logged_at )
    `)
    .eq('user_id', tgUser.id)
    .order('start_time', { ascending: false })
    .limit(50)

  if (!sessions) return []

  return sessions.map(s => ({
    id:        s.id,
    startTime: new Date(s.start_time).getTime(),
    endTime:   new Date(s.end_time).getTime(),
    cycleDay:  s.cycle_day,
    day: {
      name:   s.day_name,
      groups: s.day_groups,
    },
    logs: groupLogsByExercise(s.exercise_logs),
  }))
}

function groupLogsByExercise(rows) {
  const result = {}
  ;(rows || []).forEach(row => {
    if (!result[row.exercise_id]) result[row.exercise_id] = []
    result[row.exercise_id].push({
      weight:    row.weight,
      reps:      row.reps,
      timestamp: new Date(row.logged_at).getTime(),
    })
  })
  return result
}

// ─── Body weight ──────────────────────────────────────────────────────────────

export async function saveBodyWeight(weight) {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { error } = await supabase
    .from('body_weight_logs')
    .insert({ user_id: tgUser.id, weight })

  if (error) console.error('Save body weight error:', error)
}

export async function loadBodyWeightLog() {
  const tgUser = getTelegramUser()
  await setRLSContext(tgUser.id)

  const { data } = await supabase
    .from('body_weight_logs')
    .select('weight, logged_at')
    .eq('user_id', tgUser.id)
    .order('logged_at', { ascending: false })
    .limit(30)

  return (data || []).map(r => ({
    weight: r.weight,
    date:   r.logged_at,
  }))
}
