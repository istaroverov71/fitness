import { useState } from 'react'
import { Icon, Ring, Stepper, PillTabs, AreaChart, BarChart, Donut } from './components/ui'

export default function App() {
  const [tab, setTab] = useState('Обзор')
  const [weight, setWeight] = useState(82.5)
  const [reps, setReps] = useState(12)

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(145deg, var(--accent), var(--accent2))',
          display: 'grid', placeItems: 'center', fontSize: 20,
        }}>💪</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>FitBot</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>Этап 2 — UI Компоненты</div>
        </div>
      </div>

      {/* Icons */}
      <p className="sec">Icons</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {['chev', 'check', 'play', 'dumbbell', 'search', 'target', 'clock', 'chart', 'cal', 'flame', 'star', 'user', 'settings', 'lock', 'refresh', 'info', 'trophy', 'arrowUp', 'edit', 'close'].map(name => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Icon d={name} size={22} color="var(--text2)" />
            <span style={{ fontSize: 9, color: 'var(--text2)' }}>{name}</span>
          </div>
        ))}
      </div>

      {/* Rings */}
      <p className="sec">Ring (прогресс)</p>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center' }}>
        <Ring value={0} size={52} />
        <Ring value={35} size={52} />
        <Ring value={60} size={52} />
        <Ring value={100} size={52} />
        <Ring value={100} size={52}><Icon d="check" size={16} color="var(--success)" stroke={2.6} /></Ring>
      </div>

      {/* Steppers */}
      <p className="sec">Stepper</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>Вес, кг</div>
          <Stepper value={weight} onChange={setWeight} step={0.5} min={0} max={300} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>Повторений</div>
          <Stepper value={reps} onChange={setReps} step={1} min={1} max={50} />
        </div>
      </div>

      {/* Pill Tabs */}
      <p className="sec">Pill Tabs</p>
      <PillTabs tabs={['Обзор', 'Прогресс', 'История']} active={tab} onPick={setTab} />
      <div style={{ marginBottom: 24 }} />

      {/* Area Chart */}
      <p className="sec">Area Chart</p>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-h">
          <span className="panel-t">Жим лёжа · вес</span>
          <span className="panel-sub">8 недель</span>
        </div>
        <AreaChart values={[40, 42, 45, 44, 48, 52, 55, 58]} />
        <div className="barlbls" style={{ marginTop: 6 }}>
          {['н1','','н3','','н5','','н7',''].map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>

      {/* Bar Chart */}
      <p className="sec">Bar Chart</p>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-h">
          <span className="panel-t">Объём по неделям</span>
          <span className="panel-sub">тонн</span>
        </div>
        <BarChart bars={[
          { l: 'н1', v: 18 }, { l: 'н2', v: 24 }, { l: 'н3', v: 22 },
          { l: 'н4', v: 30 }, { l: 'н5', v: 28 }, { l: 'н6', v: 34, hot: true },
        ]} />
      </div>

      {/* Donut */}
      <p className="sec">Donut Chart</p>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Donut data={[
            { label: 'Грудь', value: 48, color: '#FF3B30' },
            { label: 'Спина', value: 42, color: '#FF6B35' },
            { label: 'Ноги', value: 36, color: '#00E676' },
            { label: 'Руки', value: 28, color: '#3DA5FF' },
            { label: 'Плечи', value: 18, color: '#A06BFF' },
          ]} />
          <div className="legend" style={{ flex: 1 }}>
            {[
              ['Грудь', 48, '#FF3B30'], ['Спина', 42, '#FF6B35'],
              ['Ноги', 36, '#00E676'], ['Руки', 28, '#3DA5FF'], ['Плечи', 18, '#A06BFF'],
            ].map(([l, v, c]) => (
              <div key={l} className="legitem">
                <span className="legdot" style={{ background: c }} />
                {l}
                <span className="legval">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}
