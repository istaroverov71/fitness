import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'

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

export default function AboutYou({ onNext, onBack }) {
  const profile = useAppStore(s => s.profile)
  const setProfile = useAppStore(s => s.setProfile)

  const [name,   setName]   = useState(profile?.name   ?? '')
  const [age,    setAge]    = useState(profile?.age     ?? '')
  const [sex,    setSex]    = useState(profile?.sex     ?? 'm')
  const [weight, setWeight] = useState(profile?.weight  ?? '')
  const [height, setHeight] = useState(profile?.height  ?? '')

  const valid = name.trim() && age && weight && height

  const handleNext = () => {
    setProfile({ ...profile, name: name.trim(), age: +age, sex, weight: +weight, height: +height })
    onNext()
  }

  return (
    <Screen>
      <TgHeader back="Назад" onBack={onBack} />
      <ScrollBody>
        <Pad>
          <Steps current={1} />
          <h1 className="h1" style={{ margin: '22px 0 6px' }}>Расскажи<br />о себе</h1>
          <p className="muted" style={{ fontSize: 15, fontWeight: 500, margin: '0 0 26px' }}>
            Нужно для точного расчёта нагрузок
          </p>

          <div className="field">
            <label>Имя</label>
            <input
              className="input"
              placeholder="Введи имя"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Возраст</label>
            <div className="input-unit">
              <input
                className="input"
                inputMode="numeric"
                placeholder="28"
                value={age}
                onChange={e => setAge(e.target.value.replace(/\D/g, ''))}
              />
              <span className="u">лет</span>
            </div>
          </div>

          <div className="field">
            <label>Пол</label>
            <div className="seg">
              <button className={sex === 'm' ? 'on' : ''} onClick={() => setSex('m')}>Мужской</button>
              <button className={sex === 'f' ? 'on' : ''} onClick={() => setSex('f')}>Женский</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Вес</label>
              <div className="input-unit">
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="80"
                  value={weight}
                  onChange={e => setWeight(e.target.value.replace(/[^\d.]/g, ''))}
                />
                <span className="u">кг</span>
              </div>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Рост</label>
              <div className="input-unit">
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="180"
                  value={height}
                  onChange={e => setHeight(e.target.value.replace(/\D/g, ''))}
                />
                <span className="u">см</span>
              </div>
            </div>
          </div>

          <button
            className="cta block"
            style={{ marginTop: 8, marginBottom: 24 }}
            onClick={handleNext}
            disabled={!valid}
          >
            Далее
          </button>
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
