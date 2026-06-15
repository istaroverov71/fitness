import { useState } from 'react'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon } from '../../components/ui'
import { MUSCLE_GROUPS, getExerciseCountByGroup } from '../../lib/exercises'
import { haptic } from '../../lib/telegram'

const GROUP_COLORS = {
  chest:     ['#FF3B30', '#FF6B35'],
  back:      ['#3DA5FF', '#1E78FF'],
  legs:      ['#A06BFF', '#7B3FE4'],
  shoulders: ['#FF9500', '#FF6B00'],
  biceps:    ['#00C9A7', '#00A68A'],
  triceps:   ['#FF2D78', '#E0005E'],
  abs:       ['#00E676', '#00B85C'],
  cardio:    ['#FF6B35', '#FF3B30'],
}

export default function MuscleGroups({ onPick }) {
  const [query, setQuery] = useState('')

  const filtered = MUSCLE_GROUPS.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Screen>
      <StatusBar />
      <TgHeader title="Упражнения" sub="справочник" />
      <ScrollBody>
        <Pad>
          {/* Search */}
          <div className="search-bar" style={{ marginBottom: 20 }}>
            <Icon d="search" size={18} />
            <input
              placeholder="Поиск упражнений"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: 0 }}
              >
                <Icon d="close" size={16} />
              </button>
            )}
          </div>

          {/* Muscle groups */}
          {filtered.map((group, i) => {
            const count = getExerciseCountByGroup(group.id)
            const colors = GROUP_COLORS[group.id] || ['var(--accent)', 'var(--accent2)']

            return (
              <div
                key={group.id}
                onClick={() => { haptic('light'); onPick(group.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 4px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none',
                  cursor: 'pointer',
                }}
              >
                {/* Color thumbnail */}
                <div style={{
                  width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                  background: `linear-gradient(135deg, ${colors[0]}33, ${colors[1]}55)`,
                  display: 'grid', placeItems: 'center',
                  border: `1px solid ${colors[0]}33`,
                  fontSize: 24,
                }}>
                  {group.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{group.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginTop: 2 }}>
                    {count} упражнений
                  </div>
                </div>

                <Icon d="chev" size={18} color="#5a5a5a" />
              </div>
            )
          })}

          <div style={{ height: 14 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
