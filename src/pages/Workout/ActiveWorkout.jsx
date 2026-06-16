import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'
import { Icon } from '../../components/ui'
import { haptic } from '../../lib/telegram'

// ─── Rest timer ────────────────────────────────────────────────────────────────

function RestTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds)
  const calledRef = { current: false }

  useEffect(() => {
    if (left <= 0) {
      if (!calledRef.current) { calledRef.current = true; onDone?.() }
      return
    }
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left]) // eslint-disable-line react-hooks/exhaustive-deps

  const pct = (left / seconds) * 100
  const min = Math.floor(left / 60)
  const sec = left % 60

  return (
    <div style={{
      background: 'var(--card)', borderRadius: 14,
      padding: '14px 16px', marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ position: 'relative', width: 42, height: 42, flexShrink: 0 }}>
        <svg width="42" height="42" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="21" cy="21" r="17" fill="none" stroke="var(--elev)" strokeWidth="3" />
          <circle cx="21" cy="21" r="17" fill="none" stroke="var(--accent)" strokeWidth="3"
            strokeDasharray={`${(pct / 100) * 107} 107`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
          {min}:{String(sec).padStart(2, '0')}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Отдых</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Следующий подход через {left}с</div>
      </div>
      <button onClick={onDone} style={{
        background: 'var(--elev)', border: 'none', borderRadius: 10,
        padding: '8px 14px', color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>Пропустить</button>
    </div>
  )
}

// ─── Stat circle ───────────────────────────────────────────────────────────────

function StatCircle({ value, lines, color }) {
  const fontSize = value.length > 4 ? 15 : value.length > 3 ? 18 : 22
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{
        width: 86, height: 86, borderRadius: '50%',
        border: `4px solid ${color}`,
        display: 'grid', placeItems: 'center',
      }}>
        <span style={{ fontSize, fontWeight: 800, color, lineHeight: 1, textAlign: 'center' }}>
          {value}
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textAlign: 'center', lineHeight: 1.35 }}>
        {lines.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}
      </div>
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtRest(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('ru', { weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit' })
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ActiveWorkout({ day, exIdx, onBack, onNext, onDone }) {
  const logSet         = useAppStore(s => s.logSet)
  const workoutLogs    = useAppStore(s => s.workoutLogs)
  const workoutHistory = useAppStore(s => s.workoutHistory)
  const finishWorkout  = useAppStore(s => s.finishWorkout)

  const exercise   = day.exercises[exIdx]
  const totalEx    = day.exercises.length
  const doneSets   = workoutLogs[exercise?.id] ?? []
  const targetSets = exercise?.sets ?? 4
  const finished   = doneSets.length >= targetSets

  // Recommended weight — max weight from last session this exercise appeared in
  const recommendedWeight = (() => {
    for (const session of workoutHistory) {
      const sets = session.logs?.[exercise?.id]
      if (sets?.length > 0) return Math.max(...sets.map(s => s.weight || 0))
    }
    return null
  })()

  // All past sessions that logged this exercise
  const exerciseHistory = workoutHistory
    .filter(s => s.logs?.[exercise?.id]?.length > 0)
    .map(s => ({ dateTs: s.startTime || s.id, sets: s.logs[exercise.id] }))

  const [weight,   setWeight]   = useState(() => recommendedWeight ?? 20)
  const [reps,     setReps]     = useState(12)
  const [resting,  setResting]  = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    setWeight(recommendedWeight ?? 20)
    setReps(12)
    setResting(false)
  }, [exIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!exercise) return null

  const handleLogSet = () => {
    if (finished) return
    haptic('medium')
    const w = parseFloat(String(weight).replace(',', '.')) || 0
    const r = parseInt(String(reps)) || 0
    logSet(exercise.id, { weight: w, reps: r, timestamp: Date.now() })
    if (doneSets.length + 1 < targetSets) setResting(true)
  }

  const handleNextEx = async () => {
    haptic('light')
    if (exIdx < totalEx - 1) {
      onNext()
    } else {
      setSaving(true)
      try {
        await finishWorkout()
        setShowDone(true)
      } catch (err) {
        console.error('Finish workout error:', err)
        setShowDone(true)
      } finally {
        setSaving(false)
      }
    }
  }

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (showDone) {
    return (
      <Screen>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center',
        }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
          <h1 className="h1" style={{ marginBottom: 12 }}>Тренировка завершена!</h1>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 40 }}>
            Отличная работа! Результаты<br />сохранены в аналитике.
          </p>
          <button className="cta block" onClick={onDone} style={{ maxWidth: 300 }}>
            На главную
          </button>
        </div>
      </Screen>
    )
  }

  const restStr   = fmtRest(exercise.restSeconds ?? 90)
  const repsStr   = String(exercise.reps ?? 12)
  const setsStr   = `${doneSets.length}/${targetSets}`
  const setsColor = finished ? 'var(--success)' : doneSets.length > 0 ? 'var(--accent)' : '#FF7B7B'

  // ── Workout screen ───────────────────────────────────────────────────────────
  return (
    <Screen>
      <TgHeader
        title={`${exIdx + 1} / ${totalEx} · ${exercise.muscleGroup}`}
        sub={exercise.name}
        back=""
        onBack={onBack}
      />
      <ScrollBody>
        <Pad>

          {/* Exercise name */}
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10, marginTop: 4 }}>
            {exercise.name}
          </div>

          {/* Recommended weight */}
          {recommendedWeight !== null && (
            <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d="target" size={14} />
              Рекомендуемый вес:
              <b style={{ color: 'var(--text)' }}> {recommendedWeight} кг</b>
              <span style={{ fontSize: 12 }}>— из прошлой тренировки</span>
            </div>
          )}

          {/* Three stat circles */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <StatCircle value={repsStr}  lines={['Повторений', 'требуется']} color="#00C9A7" />
            <StatCircle value={restStr}  lines={['Отдых']}                   color="#00C9A7" />
            <StatCircle value={setsStr}  lines={['Подходов', 'выполнено']}   color={setsColor} />
          </div>

          {/* Rest timer */}
          {resting && (
            <RestTimer
              seconds={exercise.restSeconds ?? 90}
              onDone={() => setResting(false)}
            />
          )}

          {/* Input row */}
          {!resting && !finished && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Килограммы"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Повторений"
                value={reps}
                onChange={e => setReps(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleLogSet}
                aria-label="Засчитать подход"
                style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'var(--accent)', border: 'none', cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 4px 16px rgba(255,59,48,0.35)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          )}

          {/* Finished badge */}
          {finished && (
            <div style={{
              background: 'rgba(0,230,118,0.08)', borderRadius: 'var(--radius)',
              border: '1.5px solid rgba(0,230,118,0.25)', padding: 16, marginBottom: 20,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--success)' }}>Упражнение выполнено 💪</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Все {targetSets} подхода засчитаны</div>
            </div>
          )}

          {/* Current session sets */}
          {doneSets.length > 0 && (
            <>
              <p className="sec" style={{ marginBottom: 8 }}>Текущая тренировка</p>
              <div className="donelist" style={{ marginBottom: 24 }}>
                {[...doneSets].reverse().map((s, i) => (
                  <div key={i} className="doneset">
                    <span className="doneset-num">#{doneSets.length - i}</span>
                    <span className="doneset-detail">{s.weight} кг × {s.reps} повт.</span>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{fmtTime(s.timestamp)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* History from past sessions */}
          {exerciseHistory.length > 0 && (
            <>
              <p className="sec" style={{ marginBottom: 12 }}>История выполнения</p>
              {exerciseHistory.map((session, si) => (
                <div key={si} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                    {fmtDate(session.dateTs)}
                  </div>
                  <div className="donelist">
                    {[...session.sets].reverse().map((s, i) => (
                      <div key={i} className="doneset">
                        <span className="doneset-num">#{session.sets.length - i}</span>
                        <span className="doneset-detail">{s.weight} кг × {s.reps} повт.</span>
                        <span style={{ fontSize: 12, color: 'var(--text2)' }}>{fmtTime(s.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Next / Finish */}
          <button
            className="cta block"
            style={{
              marginTop: 8, marginBottom: 16,
              background: finished ? undefined : 'var(--elev)',
              color: finished ? '#fff' : 'var(--text2)',
              boxShadow: finished ? undefined : 'none',
            }}
            onClick={finished && !saving ? handleNextEx : undefined}
            disabled={!finished || saving}
          >
            {saving
              ? 'Сохранение...'
              : exIdx < totalEx - 1 ? 'Следующее упражнение' : 'Завершить тренировку'}
            {!saving && <Icon d="chev" size={18} color={finished ? '#fff' : 'var(--text2)'} />}
          </button>

        </Pad>
      </ScrollBody>
    </Screen>
  )
}
