import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, StatusBar } from '../../components/layout'
import { generateProgram } from '../../lib/programGenerator'
import { persistProfile, persistProgram } from '../../lib/useDataSync'

const STEPS = [
  'Анализирую твои параметры...',
  'Подбираю оптимальный сплит...',
  'Составляю программу тренировок...',
  'Рассчитываю рабочие веса...',
  'Финальная настройка... ✨',
]

export default function Generating() {
  const profile = useAppStore(s => s.profile)
  const setProgram = useAppStore(s => s.setProgram)
  const setScreen = useAppStore(s => s.setScreen)

  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress steps
    const interval = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, STEPS.length - 1))
      setProgress(p => Math.min(p + 20, 95))
    }, 700)

    // Generate program and persist to Supabase
    generateProgram(profile).then(async (program) => {
      clearInterval(interval)
      setProgress(100)
      setStepIdx(STEPS.length - 1)

      // Save profile and program to DB (non-blocking — don't block UI)
      persistProfile(profile)
      const saved = await persistProgram(program)
      // If DB save returned an id, attach it so future sessions load this program
      const finalProgram = saved?.id ? { ...program, id: saved.id } : program

      setTimeout(() => {
        setProgram(finalProgram)
        setScreen('main')
      }, 600)
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <Screen>
      <StatusBar />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32, textAlign: 'center',
      }}>
        {/* Animated logo */}
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: 'linear-gradient(145deg, var(--accent), var(--accent2))',
          display: 'grid', placeItems: 'center', fontSize: 48,
          boxShadow: '0 20px 60px -20px rgba(255,59,48,0.6)',
          marginBottom: 40,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          💪
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
          Создаём программу
        </h2>
        <p className="muted" style={{ fontSize: 15, fontWeight: 500, marginBottom: 40, lineHeight: 1.5 }}>
          ИИ анализирует твои данные<br />и составляет персональный план
        </p>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: 6, borderRadius: 3,
          background: 'var(--elev)', overflow: 'hidden', marginBottom: 20,
        }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            width: `${progress}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>

        <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500, minHeight: 20 }}>
          {STEPS[stepIdx]}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </Screen>
  )
}
