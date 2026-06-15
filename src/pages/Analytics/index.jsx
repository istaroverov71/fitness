import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { PillTabs, AreaChart, BarChart, Donut, Ring } from '../../components/ui'

// ─── helpers ──────────────────────────────────────────────────────────────────

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

function formatDate(ts) {
  const d = new Date(ts)
  const weekday = d.toLocaleDateString('ru', { weekday: 'short' })
  const day = d.getDate()
  const month = d.toLocaleDateString('ru', { month: 'long' })
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${month}`
}

function formatDuration(startTime, endTime) {
  const min = Math.round((endTime - startTime) / 60000)
  if (min < 60) return `${min} мин`
  return `${Math.floor(min / 60)}ч ${min % 60}мин`
}

function countSets(logs) {
  return Object.values(logs || {}).reduce((a, sets) => a + sets.length, 0)
}

function totalVolume(logs) {
  let vol = 0
  Object.values(logs || {}).forEach(sets =>
    sets.forEach(s => { vol += (s.weight || 0) * (s.reps || 0) })
  )
  return vol
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function Overview({ history }) {
  // Muscle load for last 30 sessions
  const mgLoad = {}
  history.forEach(session => {
    session.day?.groups?.forEach(g => {
      mgLoad[g] = (mgLoad[g] || 0) + countSets(session.logs)
    })
  })

  const donutData = Object.entries(mgLoad)
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({ label: MG_NAMES[id] || id, value, color: MG_COLORS[id] || '#888' }))

  // Total stats
  const totalWorkouts = history.length
  const totalTonnage  = history.reduce((a, s) => a + totalVolume(s.logs) / 1000, 0)
  const totalTime     = history.reduce((a, s) => a + (s.endTime - s.startTime) / 3600000, 0)

  // Streak — consecutive days with workouts
  let streak = 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  for (const s of history) {
    const d = new Date(s.startTime); d.setHours(0, 0, 0, 0)
    const diff = (today - d) / 86400000
    if (diff <= streak + 1) streak++
    else break
  }

  const stats = [
    { v: totalWorkouts,               unit: '',   label: 'Тренировок',      trend: history.length > 0 ? `+${history.slice(0,4).length} за мес.` : '—' },
    { v: totalTonnage.toFixed(1),     unit: 'т',  label: 'Поднятый объём',  trend: totalTonnage > 0 ? '↑ прогресс' : '—' },
    { v: totalTime.toFixed(0),        unit: 'ч',  label: 'Время тренировок',trend: totalTime > 0 ? `~${Math.round(totalTime / Math.max(totalWorkouts,1) * 60)} мин/тр.` : '—' },
    { v: streak,                      unit: 'дн', label: 'Серия подряд',    trend: streak > 2 ? '🔥 продолжай!' : '—' },
  ]

  return (
    <>
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-v">{s.v}<small>{s.unit}</small></div>
            <div className="stat-l">{s.label}</div>
            {s.trend !== '—' && <div className="stat-trend">{s.trend}</div>}
          </div>
        ))}
      </div>

      {donutData.length > 0 ? (
        <div className="panel">
          <div className="panel-h">
            <span className="panel-t">Нагрузка по мышцам</span>
            <span className="panel-sub">все время</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Donut data={donutData} />
            <div className="legend" style={{ flex: 1 }}>
              {donutData.map(d => (
                <div key={d.label} className="legitem">
                  <span className="legdot" style={{ background: d.color }} />
                  {d.label}
                  <span className="legval">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon="📊" text="Нагрузка по мышцам появится после первых тренировок" />
      )}
    </>
  )
}

// ─── Progress tab ─────────────────────────────────────────────────────────────

function Progress({ history, bodyWeightLog }) {
  // Volume per session (tonnage in kg)
  const volumeData = history.slice(0, 8).reverse().map((s, i) => ({
    l: `т${i + 1}`,
    v: totalVolume(s.logs),
    hot: i === history.slice(0, 8).length - 1,
  }))

  // Body weight chart
  const bwValues = bodyWeightLog.slice(0, 8).reverse().map(e => e.weight)

  // Per-exercise PRs
  const prs = {}
  history.forEach(session => {
    Object.entries(session.logs || {}).forEach(([exId, sets]) => {
      const maxW = Math.max(...sets.map(s => s.weight || 0))
      if (!prs[exId] || maxW > prs[exId]) prs[exId] = maxW
    })
  })

  return (
    <>
      {volumeData.length >= 2 ? (
        <div className="panel">
          <div className="panel-h">
            <span className="panel-t">Объём тренировок</span>
            <span className="panel-sub">кг/сессия</span>
          </div>
          <BarChart bars={volumeData} />
          <div className="barlbls" style={{ marginTop: 6 }}>
            {volumeData.map(b => <span key={b.l}>{b.l}</span>)}
          </div>
        </div>
      ) : (
        <EmptyState icon="📈" text="График объёма появится после 2+ тренировок" />
      )}

      {bwValues.length >= 2 ? (
        <div className="panel">
          <div className="panel-h">
            <span className="panel-t">Вес тела</span>
            <span className="panel-sub">{bwValues.length} замеров</span>
          </div>
          <AreaChart values={bwValues} color="var(--success)" />
          <div className="barlbls" style={{ marginTop: 6 }}>
            <span>раньше</span>
            {Array(bwValues.length - 2).fill('').map((_, i) => <span key={i} />)}
            <span>сейчас</span>
          </div>
        </div>
      ) : (
        <EmptyState icon="⚖️" text="Добавь замеры веса в профиле — появится график" />
      )}

      {Object.keys(prs).length > 0 && (
        <div className="panel">
          <div className="panel-h">
            <span className="panel-t">Личные рекорды</span>
            <span className="panel-sub">🏆 PR</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {Object.entries(prs).slice(0, 6).map(([exId, weight], i, arr) => (
              <div key={exId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>{exId.replace(/_\d+$/, '').replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{weight} кг</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ─── History tab ──────────────────────────────────────────────────────────────

function History({ history }) {
  if (history.length === 0) {
    return <EmptyState icon="📅" text="История тренировок появится после первой завершённой тренировки" />
  }

  // Group by date
  const groups = {}
  history.forEach(session => {
    const key = new Date(session.startTime).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(session)
  })

  return (
    <>
      {Object.entries(groups).map(([dateKey, sessions]) => (
        <div key={dateKey}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--text2)',
            margin: '16px 0 8px',
          }}>
            {formatDate(new Date(dateKey).getTime())}
          </div>
          {sessions.map(session => {
            const sets = countSets(session.logs)
            const exCount = Object.keys(session.logs || {}).length
            const duration = session.endTime
              ? formatDuration(session.startTime, session.endTime)
              : '—'

            return (
              <div key={session.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--card)', borderRadius: 14,
                padding: '13px 16px', marginBottom: 10,
                border: '1px solid var(--divider)',
              }}>
                <Ring value={100} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {session.day?.name ?? 'Тренировка'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginTop: 2 }}>
                    {exCount} упр. · {sets} подходов · {duration}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              </div>
            )
          })}
        </div>
      ))}
      <div style={{ height: 16 }} />
    </>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ icon, text }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 16,
      padding: '28px 20px', textAlign: 'center', marginBottom: 14,
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text2)', lineHeight: 1.5 }}>{text}</div>
    </div>
  )
}

// ─── Main Analytics screen ────────────────────────────────────────────────────

export default function AnalyticsTab() {
  const [tab, setTab] = useState('Обзор')
  const history      = useAppStore(s => s.workoutHistory)
  const bodyWeightLog = useAppStore(s => s.bodyWeightLog)

  return (
    <Screen>
      <StatusBar />
      <TgHeader title="Аналитика" sub="твой прогресс" />
      <ScrollBody>
        <Pad>
          <PillTabs
            tabs={['Обзор', 'Прогресс', 'История']}
            active={tab}
            onPick={setTab}
          />
          <div style={{ height: 8 }} />
          {tab === 'Обзор'    && <Overview  history={history} />}
          {tab === 'Прогресс' && <Progress  history={history} bodyWeightLog={bodyWeightLog} />}
          {tab === 'История'  && <History   history={history} />}
          <div style={{ height: 14 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
