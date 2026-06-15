import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon, Stepper, AreaChart } from '../../components/ui'
import { haptic } from '../../lib/telegram'

const LEVEL_NAMES = { beginner: 'Новичок', amateur: 'Любитель', pro: 'Опытный' }
const GOAL_NAMES  = { mass: 'Набор массы', cut: 'Похудение' }

export default function ProfileScreen({ onBack, onEdit }) {
  const profile       = useAppStore(s => s.profile)
  const bodyWeightLog = useAppStore(s => s.bodyWeightLog)
  const addBodyWeight = useAppStore(s => s.addBodyWeight)
  const history       = useAppStore(s => s.workoutHistory)

  const currentWeight = bodyWeightLog[0]?.weight ?? profile?.weight ?? 80
  const [weight, setWeight] = useState(currentWeight)
  const [saved,  setSaved]  = useState(false)

  const chartValues = bodyWeightLog.slice(0, 8).reverse().map(e => e.weight)

  const handleSave = () => {
    haptic('medium')
    addBodyWeight(weight)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const goalWeight  = profile?.goalWeight
  const diff        = goalWeight ? (goalWeight - weight).toFixed(1) : null
  const isGain      = profile?.goal === 'mass'

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title="Профиль"
        sub="FitBot"
        back="Тренировка"
        onBack={onBack}
        right={
          <button
            onClick={onEdit}
            style={{
              background: 'var(--elev)', border: 'none', borderRadius: 10,
              padding: '6px 14px', color: 'var(--text2)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 6,
            }}
          >
            <Icon d="edit" size={15} />Изменить
          </button>
        }
      />
      <ScrollBody>
        <Pad>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '6px 0 22px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(145deg, var(--accent), var(--accent2))',
              display: 'grid', placeItems: 'center',
              fontSize: 30, fontWeight: 800, color: '#fff',
            }}>
              {profile?.name?.[0]?.toUpperCase() ?? 'И'}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
                {profile?.name ?? 'Атлет'}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text2)', marginTop: 3 }}>
                {LEVEL_NAMES[profile?.level] ?? 'Любитель'} · {GOAL_NAMES[profile?.goal] ?? 'Набор массы'}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { v: history.length,      label: 'Тренировок' },
              { v: profile?.height ? `${profile.height} см` : '—', label: 'Рост' },
              { v: profile?.age   ? `${profile.age} лет`  : '—', label: 'Возраст' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--card)', borderRadius: 14, padding: '14px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Weight panel */}
          <div className="panel">
            <div className="panel-h">
              <span className="panel-t">Текущий вес</span>
              <span className="panel-sub">обнови после взвешивания</span>
            </div>

            <div className="weight-big">
              <div className="v">{weight}<small>кг</small></div>
              {diff !== null && (
                <div className="g">
                  Цель: {goalWeight} кг · осталось{' '}
                  <b>{isGain && diff > 0 ? '+' : ''}{diff} кг</b>
                </div>
              )}
            </div>

            <Stepper value={weight} onChange={setWeight} step={0.1} min={30} max={250} />

            <button
              className="cta block"
              style={{ marginTop: 12 }}
              onClick={handleSave}
            >
              {saved
                ? <><Icon d="check" size={19} color="#fff" stroke={2.6} /> Сохранено!</>
                : <><Icon d="check" size={19} color="#fff" stroke={2.6} /> Сохранить замер</>
              }
            </button>
          </div>

          {/* Weight dynamics chart */}
          {chartValues.length >= 2 && (
            <div className="panel">
              <div className="panel-h">
                <span className="panel-t">Динамика веса</span>
                <span className="panel-sub">{chartValues.length} замеров</span>
              </div>
              <AreaChart values={chartValues} color="var(--success)" />
              <div className="barlbls" style={{ marginTop: 6 }}>
                <span>раньше</span>
                {Array(chartValues.length - 2).fill('').map((_, i) => <span key={i} />)}
                <span>сейчас</span>
              </div>
            </div>
          )}

          {/* Parameters list */}
          <p className="sec" style={{ margin: '8px 0 4px' }}>Параметры</p>
          {[
            { icon: 'target', label: 'Цель',              value: GOAL_NAMES[profile?.goal] ?? '—' },
            { icon: 'flame',  label: 'Уровень',           value: LEVEL_NAMES[profile?.level] ?? '—' },
            { icon: 'cal',    label: 'Тренировок в нед.', value: profile?.daysPerWeek ? `${profile.daysPerWeek} раза` : '—' },
            { icon: 'chart',  label: 'Рост',              value: profile?.height ? `${profile.height} см` : '—' },
            { icon: 'user',   label: 'Пол',               value: profile?.sex === 'm' ? 'Мужской' : 'Женский' },
          ].map(({ icon, label, value }, i, arr) => (
            <div
              key={label}
              className="frow"
              onClick={onEdit}
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}
            >
              <div className="frow-ic"><Icon d={icon} size={17} /></div>
              <div className="frow-l">{label}</div>
              <div className="frow-v">{value}</div>
              <Icon d="chev" size={16} color="#5a5a5a" />
            </div>
          ))}

          <div style={{ height: 24 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
