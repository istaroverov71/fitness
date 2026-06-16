import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon } from '../../components/ui'

function Steps({ current, total = 3 }) {
  return (
    <div className="steps">
      <div className="steps-track">
        <div className="steps-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className="steps-label">Шаг {current} из {total}</span>
    </div>
  )
}

const GOALS = [
  { id: 'mass', emoji: '💪', title: 'Набор массы',    desc: 'Растим силу и объём мышц' },
  { id: 'cut',  emoji: '🔥', title: 'Похудение',      desc: 'Сжигаем жир, сохраняем мышцы' },
]

const LEVELS = [
  { id: 'beginner', label: 'Новичок' },
  { id: 'amateur',  label: 'Любитель' },
  { id: 'pro',      label: 'Опытный' },
]

export default function GoalLevel({ onNext, onBack }) {
  const profile = useAppStore(s => s.profile)
  const setProfile = useAppStore(s => s.setProfile)

  const [goal,       setGoal]       = useState(profile?.goal       ?? 'mass')
  const [level,      setLevel]      = useState(profile?.level      ?? 'amateur')
  const [days,       setDays]       = useState(profile?.daysPerWeek ?? 4)
  const [goalWeight, setGoalWeight] = useState(profile?.goalWeight  ?? '')

  const handleNext = () => {
    setProfile({ ...profile, goal, level, daysPerWeek: days, goalWeight: +goalWeight || null })
    onNext()
  }

  return (
    <Screen>
      <StatusBar />
      <TgHeader back="Назад" onBack={onBack} />
      <ScrollBody>
        <Pad>
          <Steps current={2} />
          <h1 className="h1" style={{ margin: '22px 0 22px' }}>Твоя цель</h1>

          {/* Goal cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {GOALS.map(g => (
              <div
                key={g.id}
                className={'goal' + (goal === g.id ? ' on' : '')}
                onClick={() => setGoal(g.id)}
              >
                <div className="goal-emoji">{g.emoji}</div>
                <div>
                  <div className="goal-t">{g.title}</div>
                  <div className="goal-d">{g.desc}</div>
                </div>
                <div className="goal-check">
                  <Icon d="check" size={15} color="#fff" stroke={2.6} />
                </div>
              </div>
            ))}
          </div>

          {/* Goal weight */}
          <div className="field">
            <label>Целевой вес (необязательно)</label>
            <div className="input-unit">
              <input
                className="input"
                inputMode="decimal"
                placeholder={goal === 'mass' ? '90' : '75'}
                value={goalWeight}
                onChange={e => setGoalWeight(e.target.value.replace(/[^\d.]/g, ''))}
              />
              <span className="u">кг</span>
            </div>
          </div>

          {/* Level */}
          <p className="sec" style={{ marginTop: 4 }}>Твой уровень</p>
          <div className="chips" style={{ marginBottom: 28 }}>
            {LEVELS.map(l => (
              <button
                key={l.id}
                className={'chip' + (level === l.id ? ' on' : '')}
                onClick={() => setLevel(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Days per week */}
          <p className="sec">Тренировок в неделю</p>
          <div className="slider-head">
            <div className="slider-val">
              {days}<small> раза в нед.</small>
            </div>
          </div>
          <input
            type="range"
            className="rng"
            min={2} max={6} step={1}
            value={days}
            onChange={e => setDays(+e.target.value)}
          />
          <div className="rng-ticks">
            <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
          </div>

          <button
            className="cta block"
            style={{ marginTop: 28, marginBottom: 24 }}
            onClick={handleNext}
          >
            Создать мою программу ✨
          </button>
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
