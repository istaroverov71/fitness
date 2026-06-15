import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon, ExerciseImage, AreaChart } from '../../components/ui'
import { MUSCLE_GROUPS } from '../../lib/exercises'

const MUSCLE_NAME = Object.fromEntries(MUSCLE_GROUPS.map(g => [g.id, g.name]))

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ru', { weekday: 'short', day: 'numeric', month: 'long' })
}

export default function ExerciseDetail({ exercise, onBack }) {
  const history = useAppStore(s => s.workoutHistory)

  // Gather all sets for this exercise from workout history
  const allSets = []
  const bySession = []
  history.forEach(session => {
    const sets = session.logs?.[exercise.id]
    if (sets?.length) {
      bySession.push({ date: session.startTime, sets })
      sets.forEach(s => allSets.push(s))
    }
  })

  // Build weight progress chart (max weight per session)
  const chartValues = bySession.slice(-8).map(s => Math.max(...s.sets.map(set => set.weight)))

  // Personal record
  const pr = allSets.length ? Math.max(...allSets.map(s => s.weight)) : null

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title={MUSCLE_NAME[exercise.muscleGroup] ?? 'Упражнение'}
        sub={exercise.name}
        back="Назад"
        onBack={onBack}
      />
      <ScrollBody>
        <Pad>
          {/* Exercise image */}
          <div style={{
            height: 260, borderRadius: 16, overflow: 'hidden',
            background: 'var(--elev)', marginBottom: 18,
          }}>
            <ExerciseImage
              src={exercise.gifUrl}
              muscleGroup={exercise.muscleGroup}
              alt={exercise.name}
              style={{ height: '100%' }}
            />
          </div>

          {/* Title */}
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            {exercise.name}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0 4px' }}>
            <span className="tag" style={{ background: 'var(--elev)' }}>{MUSCLE_NAME[exercise.muscleGroup]}</span>
            <span className="tag" style={{ background: 'var(--elev)' }}>{exercise.equipment}</span>
            <span className="tag" style={{ background: 'var(--elev)' }}>{exercise.sets} × {exercise.reps}</span>
            {pr && (
              <span className="tag" style={{ background: 'rgba(255,59,48,0.12)', color: 'var(--accent)' }}>
                🏆 Рекорд: {pr} кг
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text2)', marginTop: 16 }}>
            {exercise.description}
          </p>

          {/* Tips */}
          {exercise.tips?.length > 0 && (
            <>
              <p className="sec" style={{ margin: '22px 0 12px' }}>Советы по технике</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {exercise.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: 'var(--card)', borderRadius: 12, padding: '12px 14px',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: 'rgba(255,59,48,0.15)',
                      display: 'grid', placeItems: 'center',
                      fontSize: 12, fontWeight: 800, color: 'var(--accent)',
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text2)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Weight progress chart */}
          {chartValues.length >= 2 && (
            <>
              <p className="sec" style={{ margin: '24px 0 0' }}>Прогресс веса</p>
              <div className="panel" style={{ marginTop: 12 }}>
                <div className="panel-h">
                  <span className="panel-t">Максимальный вес</span>
                  <span className="panel-sub">{chartValues.length} сессий</span>
                </div>
                <AreaChart values={chartValues} />
              </div>
            </>
          )}

          {/* Session history */}
          {bySession.length > 0 && (
            <>
              <p className="sec" style={{ margin: '8px 0 4px' }}>История выполнения</p>
              {bySession.slice(0, 5).map((session, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--text2)',
                    margin: '16px 0 4px',
                  }}>
                    {formatDate(session.date)}
                  </div>
                  {session.sets.map((s, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 0', borderBottom: '1px solid var(--divider)',
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>
                        <b style={{ color: 'var(--accent)' }}>№{j + 1}</b>
                        &nbsp; {s.weight} кг × {s.reps} повт.
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>
                        {new Date(s.timestamp).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {bySession.length === 0 && (
            <div style={{
              background: 'var(--card)', borderRadius: 14,
              padding: '20px 16px', marginTop: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>
                История появится после первой тренировки с этим упражнением
              </div>
            </div>
          )}

          <div style={{ height: 24 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
