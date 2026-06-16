import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'
import { Icon, Stepper, ExerciseImage } from '../../components/ui'
import { haptic } from '../../lib/telegram'

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
      padding: '14px 16px', marginTop: 14,
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
      <button
        onClick={onDone}
        style={{
          background: 'var(--elev)', border: 'none', borderRadius: 10,
          padding: '8px 14px', color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Пропустить
      </button>
    </div>
  )
}

export default function ActiveWorkout({ day, exIdx, onBack, onNext, onChangeEx, onDone }) {
  const logSet        = useAppStore(s => s.logSet)
  const workoutLogs   = useAppStore(s => s.workoutLogs)
  const finishWorkout = useAppStore(s => s.finishWorkout)

  const exercise   = day.exercises[exIdx]
  const totalEx    = day.exercises.length
  const doneSets   = workoutLogs[exercise?.id] ?? []
  const targetSets = exercise?.sets ?? 4
  const finished   = doneSets.length >= targetSets

  const [weight,   setWeight]   = useState(20)
  const [reps,     setReps]     = useState(12)
  const [resting,  setResting]  = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    setWeight(20); setReps(12); setResting(false)
  }, [exIdx])

  if (!exercise) return null

  const handleLogSet = () => {
    if (finished) return
    haptic('medium')
    logSet(exercise.id, { weight, reps, timestamp: Date.now() })
    if (doneSets.length + 1 < targetSets) setResting(true)
  }

  const handleResetSet = () => {
    haptic('light')
    setWeight(20)
    setReps(exercise.reps ? parseInt(exercise.reps) || 12 : 12)
    setResting(false)
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
        setShowDone(true) // still show done — data is in localStorage
      } finally {
        setSaving(false)
      }
    }
  }

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
          {/* Side buttons */}
          <div style={{ position: 'absolute', right: 16, top: 106, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleResetSet}
              title="Сбросить ввод"
              style={{
                width: 42, height: 42, borderRadius: 12, background: 'var(--card)',
                display: 'grid', placeItems: 'center', color: 'var(--text2)',
                border: '1px solid var(--divider)', cursor: 'pointer',
              }}
            >
              <Icon d="refresh" size={19} />
            </button>
          </div>

          {/* Exercise image */}
          <div style={{
            height: 200, borderRadius: 16, overflow: 'hidden',
            background: 'var(--elev)', marginBottom: 18,
          }}>
            <ExerciseImage
              src={exercise.gifUrl}
              muscleGroup={exercise.muscleGroup}
              alt={exercise.name}
              style={{ height: '100%' }}
            />
          </div>

          {/* Name + target */}
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15, marginBottom: 10 }}>
            {exercise.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className="tag tag-muted"><Icon d="target" size={12} />Цель: {targetSets} × {exercise.reps}</span>
            <span className={`tag ${doneSets.length >= targetSets ? 'tag-success' : 'tag-muted'}`}>
              Выполнено: {doneSets.length}/{targetSets}
            </span>
          </div>

          {/* Rest timer */}
          {resting && (
            <RestTimer
              seconds={exercise.restSeconds ?? 90}
              onDone={() => setResting(false)}
            />
          )}

          {/* Set input card */}
          {!resting && !finished && (
            <div style={{
              background: 'var(--elev)', borderRadius: 'var(--radius)',
              padding: 16, border: '1.5px solid var(--divider)', marginTop: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Подход {doneSets.length + 1}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                  <Icon d="clock" size={15} />
                  Отдых {exercise.restSeconds ?? 90}с
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Вес, кг</label>
                  <Stepper value={weight} onChange={setWeight} step={0.5} min={0} max={300} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Повторений</label>
                  <Stepper value={reps} onChange={setReps} step={1} min={1} max={100} />
                </div>
              </div>
              <button className="cta block" onClick={handleLogSet}>
                <Icon d="check" size={20} color="#fff" stroke={2.6} /> Засчитать подход
              </button>
            </div>
          )}

          {/* Finished badge */}
          {finished && (
            <div style={{
              background: 'rgba(0,230,118,0.08)', borderRadius: 'var(--radius)',
              border: '1.5px solid rgba(0,230,118,0.25)', padding: 16, marginTop: 14,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--success)' }}>Упражнение выполнено 💪</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Все {targetSets} подхода засчитаны</div>
            </div>
          )}

          {/* Done sets list */}
          {doneSets.length > 0 && (
            <>
              <p className="sec" style={{ margin: '18px 0 10px' }}>Выполненные подходы</p>
              <div className="donelist">
                {doneSets.map((s, i) => (
                  <div key={i} className="doneset">
                    <span className="doneset-num">{i + 1}</span>
                    <span className="doneset-detail">
                      {s.weight} кг <small>×</small> {s.reps} <small>повт.</small>
                    </span>
                    <Icon d="check" size={17} color="var(--success)" stroke={2.6} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Technique */}
          <div style={{
            background: 'var(--card)', borderRadius: 14,
            padding: 16, marginTop: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Техника
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)', margin: 0 }}>
              {exercise.description}
            </p>
            {exercise.tips?.length > 0 && (
              <ul style={{ margin: '12px 0 0', padding: '0 0 0 18px' }}>
                {exercise.tips.map((tip, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4, lineHeight: 1.4 }}>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Next / Finish button */}
          <button
            className="cta block"
            style={{
              marginTop: 18, marginBottom: 16,
              background: finished ? undefined : 'var(--elev)',
              color: finished ? '#fff' : 'var(--text2)',
              boxShadow: finished ? undefined : 'none',
            }}
            onClick={finished && !saving ? handleNextEx : undefined}
            disabled={!finished || saving}
          >
            {saving
              ? 'Сохранение...'
              : exIdx < totalEx - 1 ? 'Следующее упражнение' : 'Завершить тренировку'
            }
            {!saving && <Icon d="chev" size={18} color={finished ? '#fff' : 'var(--text2)'} />}
          </button>
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
