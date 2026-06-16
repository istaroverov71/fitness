import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'
import { Ring, ExerciseImage } from '../../components/ui'
import { haptic } from '../../lib/telegram'

export default function ExerciseList({ day, onBack, onStart }) {
  const logs    = useAppStore(s => s.workoutHistory)
  const profile = useAppStore(s => s.profile)

  // Check if each exercise has been completed (from last session of same day type)
  const lastSession = logs.find(s => s.day?.name === day?.name)
  const doneLogs    = lastSession?.logs ?? {}

  if (!day) return null

  return (
    <Screen>
      <TgHeader title={day.name} sub={`${day.exercises.length} упражнений`} back="Назад" onBack={onBack} />
      <ScrollBody>
        <Pad>
          {/* Day header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--card)', borderRadius: 14,
            padding: '14px 16px', marginBottom: 16,
            border: '1px solid var(--divider)',
          }}>
            <Ring value={0} size={46} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>
                Следующая тренировка
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 1 }}>{day.name}</div>
            </div>
          </div>

          {/* Exercise rows */}
          {day.exercises.map((ex, i) => {
            const doneSets = (doneLogs[ex.id] || []).length
            const targetSets = ex.sets ?? 3
            const pct = targetSets > 0 ? Math.round((doneSets / targetSets) * 100) : 0

            return (
              <div
                key={ex.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 4px',
                  borderBottom: i < day.exercises.length - 1 ? '1px solid var(--divider)' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => haptic('light')}
              >
                {/* Thumbnail */}
                <div style={{ width: 58, height: 58, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--elev)' }}>
                  <ExerciseImage
                    src={ex.gifUrl}
                    muscleGroup={ex.muscleGroup}
                    alt={ex.name}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ex.name}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginTop: 4 }}>
                    {ex.note ? ex.note + ' · ' : ''}{ex.sets} × {ex.reps}
                  </div>
                </div>

                {/* Status */}
                {pct > 0 ? (
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: pct >= 100 ? 'var(--success)' : 'var(--accent)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {pct}%
                  </div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
              </div>
            )
          })}

          <div style={{ height: 100 }} />
        </Pad>

        {/* Sticky start button */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: 16,
          background: 'linear-gradient(0deg, var(--bg) 70%, transparent)',
        }}>
          <button
            className="cta block"
            onClick={() => { haptic('medium'); onStart() }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M5 3l14 9-14 9V3z" /></svg>
            Начать тренировку
          </button>
        </div>
      </ScrollBody>
    </Screen>
  )
}
