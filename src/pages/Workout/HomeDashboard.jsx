import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon, Ring, PillTabs } from '../../components/ui'
import { haptic } from '../../lib/telegram'

const MG_COLORS = {
  chest: '#FF3B30', back: '#3DA5FF', legs: '#A06BFF',
  shoulders: '#FF9500', biceps: '#00C9A7', triceps: '#FF2D78',
  abs: '#00E676', cardio: '#FF6B35',
}
const MG_NAMES = {
  chest: 'Грудь', back: 'Спина', legs: 'Ноги',
  shoulders: 'Плечи', biceps: 'Бицепс', triceps: 'Трицепс',
  abs: 'Пресс', cardio: 'Кардио',
}

export default function HomeDashboard({ onOpenDay, onProfile }) {
  const profile        = useAppStore(s => s.profile)
  const program        = useAppStore(s => s.program)
  const cycleDay       = useAppStore(s => s.currentCycleDay)
  const history        = useAppStore(s => s.workoutHistory)
  const setTab         = useAppStore(s => s.setTab)
  const [mgTab, setMgTab] = useState('Неделя')

  if (!program) return null

  const totalDays   = program.days.length
  const currentDay  = program.days[cycleDay % totalDays]

  // Next 3 workouts in the queue
  const upcoming = [0, 1, 2].map(offset => {
    const idx = (cycleDay + offset) % totalDays
    return { ...program.days[idx], offset, done: offset === 0 && history[0]?.cycleDay === cycleDay }
  })

  // Muscle load stats from history (last 7 sessions)
  const recent = history.slice(0, 7)
  const mgLoad = {}
  recent.forEach(session => {
    session.day?.groups?.forEach(g => {
      mgLoad[g] = (mgLoad[g] || 0) + 1
    })
  })
  const mgEntries = Object.entries(mgLoad).sort((a, b) => b[1] - a[1])

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title="Тренировки"
        sub="FitBot"
        avatar={profile?.name?.[0]?.toUpperCase() ?? 'И'}
        onAvatar={onProfile}
      />
      <ScrollBody>
        <Pad>
          {/* Program hero card */}
          <div
            onClick={() => { haptic('light'); onOpenDay(currentDay) }}
            style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--card), var(--elev))',
              marginBottom: 22, cursor: 'pointer',
              border: '1px solid var(--divider)',
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,rgba(13,13,13,.95) 0%,rgba(13,13,13,.5) 60%,transparent)',
              zIndex: 1,
            }} />
            {/* Decorative accent */}
            <div style={{
              position: 'absolute', right: -20, top: -20,
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,59,48,0.2), transparent 70%)',
            }} />
            <div style={{
              position: 'relative', zIndex: 2,
              padding: '20px 16px', minHeight: 108,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                Следующая тренировка
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, maxWidth: '78%' }}>
                {currentDay.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag" style={{ height: 22 }}>
                  <Icon d="dumbbell" size={11} />{currentDay.exercises.length} упр.
                </span>
                {history.length > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                    Всего тренировок: {history.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming workouts */}
          <p className="sec" style={{ marginBottom: 10 }}>Следующие тренировки</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {upcoming.map((day, i) => (
              <div
                key={i}
                onClick={() => { haptic('light'); onOpenDay(day) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--card)', borderRadius: 14, padding: '13px 16px',
                  cursor: 'pointer', opacity: i > 1 ? 0.5 : 1,
                  border: i === 0 ? '1px solid rgba(255,59,48,0.3)' : '1px solid transparent',
                }}
              >
                <Ring value={i === 0 ? (day.done ? 100 : 0) : 0} size={44}>
                  {i > 1 ? <Icon d="lock" size={16} color="#5a5a5a" /> : null}
                </Ring>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>
                    {i === 0 ? 'Сейчас' : i === 1 ? 'Следующая' : 'После'}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 1 }}>{day.name}</div>
                </div>
                {i === 0 && (
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Muscle load */}
          <p className="sec" style={{ margin: '0 0 12px' }}>Нагрузка по мышцам</p>
          <PillTabs tabs={['Неделя', 'Месяц', 'Всё время']} active={mgTab} onPick={setMgTab} />
          <div style={{ marginTop: 14 }}>
            {mgEntries.length === 0 ? (
              <div style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
                Здесь появится статистика после первых тренировок
              </div>
            ) : (
              mgEntries.map(([group, count]) => (
                <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3, flexShrink: 0,
                    background: MG_COLORS[group] || 'var(--accent)',
                  }} />
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{MG_NAMES[group] || group}</div>
                  <div style={{
                    height: 6, flex: 2, borderRadius: 3,
                    background: 'var(--elev)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      background: MG_COLORS[group] || 'var(--accent)',
                      width: `${Math.round((count / (recent.length || 1)) * 100)}%`,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', minWidth: 24, textAlign: 'right' }}>
                    {count}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ height: 16 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
