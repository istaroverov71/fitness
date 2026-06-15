import { useState } from 'react'
import { Screen, ScrollBody, Pad, StatusBar, TgHeader } from '../../components/layout'
import { Icon, ExerciseImage } from '../../components/ui'
import { MUSCLE_GROUPS, getExercisesByGroup } from '../../lib/exercises'
import { haptic } from '../../lib/telegram'

export default function GroupExercises({ groupId, onBack, onPick }) {
  const [query, setQuery] = useState('')

  const group     = MUSCLE_GROUPS.find(g => g.id === groupId)
  const exercises = getExercisesByGroup(groupId)
  const filtered  = exercises.filter(ex =>
    ex.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Screen>
      <StatusBar />
      <TgHeader
        title={group?.name ?? 'Упражнения'}
        sub={`${exercises.length} упражнений`}
        back="Назад"
        onBack={onBack}
      />
      <ScrollBody>
        <Pad>
          {/* Search */}
          <div className="search-bar" style={{ marginBottom: 16 }}>
            <Icon d="search" size={18} />
            <input
              placeholder={`Поиск в ${group?.name ?? 'группе'}`}
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

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '32px 0', fontSize: 15 }}>
              Ничего не найдено
            </div>
          )}

          {filtered.map((ex, i) => (
            <div
              key={ex.id}
              onClick={() => { haptic('light'); onPick(ex) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 4px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none',
                cursor: 'pointer',
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 58, height: 58, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--elev)' }}>
                <ExerciseImage
                  src={ex.gifUrl}
                  muscleGroup={ex.muscleGroup}
                  alt={ex.name}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 15, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3, fontWeight: 600 }}>
                  {ex.equipment} · {ex.sets} × {ex.reps}
                </div>
              </div>

              <Icon d="chev" size={18} color="#5a5a5a" />
            </div>
          ))}

          <div style={{ height: 14 }} />
        </Pad>
      </ScrollBody>
    </Screen>
  )
}
