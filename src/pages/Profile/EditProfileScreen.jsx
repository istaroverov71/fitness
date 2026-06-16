import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'
import { Icon } from '../../components/ui'
import { haptic } from '../../lib/telegram'
import { persistProfile } from '../../lib/useDataSync'

const GOALS = [
  { id: 'mass', label: 'Набор массы' },
  { id: 'cut',  label: 'Похудение' },
]
const LEVELS = [
  { id: 'beginner', label: 'Новичок' },
  { id: 'amateur',  label: 'Любитель' },
  { id: 'pro',      label: 'Опытный' },
]

export default function EditProfileScreen({ onBack }) {
  const profile    = useAppStore(s => s.profile)
  const setProfile = useAppStore(s => s.setProfile)

  const [name,       setName]       = useState(profile?.name       ?? '')
  const [age,        setAge]        = useState(String(profile?.age  ?? ''))
  const [sex,        setSex]        = useState(profile?.sex         ?? 'm')
  const [height,     setHeight]     = useState(String(profile?.height ?? ''))
  const [goalWeight, setGoalWeight] = useState(String(profile?.goalWeight ?? ''))
  const [goal,       setGoal]       = useState(profile?.goal        ?? 'mass')
  const [level,      setLevel]      = useState(profile?.level       ?? 'amateur')
  const [days,       setDays]       = useState(profile?.daysPerWeek ?? 4)
  const [saved,      setSaved]      = useState(false)

  const handleSave = () => {
    haptic('medium')
    const updated = {
      ...profile,
      name: name.trim(),
      age: +age || profile?.age,
      sex,
      height: +height || profile?.height,
      goalWeight: +goalWeight || null,
      goal,
      level,
      daysPerWeek: days,
    }
    setProfile(updated)
    persistProfile(updated)
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 800)
  }

  return (
    <Screen>
      <TgHeader title="Личные данные" sub="редактирование" back="Профиль" onBack={onBack} />
      <ScrollBody>
        <Pad>
          {/* Name */}
          <div className="field">
            <label>Имя</label>
            <input className="input" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Age + Height */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Возраст</label>
              <div className="input-unit">
                <input className="input" inputMode="numeric" placeholder="28"
                  value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ''))} />
                <span className="u">лет</span>
              </div>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Рост</label>
              <div className="input-unit">
                <input className="input" inputMode="numeric" placeholder="180"
                  value={height} onChange={e => setHeight(e.target.value.replace(/\D/g, ''))} />
                <span className="u">см</span>
              </div>
            </div>
          </div>

          {/* Goal weight */}
          <div className="field">
            <label>Целевой вес</label>
            <div className="input-unit">
              <input className="input" inputMode="decimal" placeholder="90"
                value={goalWeight} onChange={e => setGoalWeight(e.target.value.replace(/[^\d.]/g, ''))} />
              <span className="u">кг</span>
            </div>
          </div>

          {/* Sex */}
          <div className="field">
            <label>Пол</label>
            <div className="seg">
              <button className={sex === 'm' ? 'on' : ''} onClick={() => setSex('m')}>Мужской</button>
              <button className={sex === 'f' ? 'on' : ''} onClick={() => setSex('f')}>Женский</button>
            </div>
          </div>

          {/* Goal */}
          <p className="sec" style={{ margin: '8px 0 12px' }}>Цель</p>
          <div className="chips" style={{ marginBottom: 20 }}>
            {GOALS.map(g => (
              <button key={g.id} className={'chip' + (goal === g.id ? ' on' : '')} onClick={() => setGoal(g.id)}>
                {g.label}
              </button>
            ))}
          </div>

          {/* Level */}
          <p className="sec" style={{ margin: '0 0 12px' }}>Уровень</p>
          <div className="chips" style={{ marginBottom: 20 }}>
            {LEVELS.map(l => (
              <button key={l.id} className={'chip' + (level === l.id ? ' on' : '')} onClick={() => setLevel(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Days per week */}
          <p className="sec" style={{ margin: '0 0 8px' }}>Тренировок в неделю</p>
          <div className="slider-head">
            <div className="slider-val">{days}<small> раза в нед.</small></div>
          </div>
          <input type="range" className="rng" min={2} max={6} step={1}
            value={days} onChange={e => setDays(+e.target.value)} />
          <div className="rng-ticks">
            <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
          </div>

          <button className="cta block" style={{ marginTop: 28, marginBottom: 24 }} onClick={handleSave}>
            {saved
              ? <><Icon d="check" size={20} color="#fff" stroke={2.6} /> Сохранено!</>
              : <><Icon d="check" size={20} color="#fff" stroke={2.6} /> Сохранить</>
            }
          </button>
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
