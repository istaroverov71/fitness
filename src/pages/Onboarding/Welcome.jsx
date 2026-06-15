import { Screen, ScrollBody, StatusBar } from '../../components/layout'

function Logo() {
  return (
    <div style={{
      width: 92, height: 92, borderRadius: 26,
      background: 'linear-gradient(145deg, var(--accent), var(--accent2))',
      display: 'grid', placeItems: 'center',
      boxShadow: '0 20px 60px -20px rgba(255,59,48,0.6)',
      fontSize: 44,
    }}>
      💪
    </div>
  )
}

export default function Welcome({ onNext }) {
  return (
    <Screen>
      <StatusBar />
      <ScrollBody>
        {/* Glow background */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 340,
          background: 'radial-gradient(circle, rgba(255,59,48,0.28), transparent 62%)',
          filter: 'blur(8px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', padding: '64px 24px 32px',
          position: 'relative', zIndex: 1, minHeight: '100%',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, marginTop: 40 }}>
            <Logo />
            <div>
              <div style={{
                fontSize: 13, fontWeight: 700, letterSpacing: '0.22em',
                color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 18,
              }}>
                FitBot
              </div>
              <h1 className="h1" style={{ fontSize: 40 }}>
                Твой<br />ИИ-тренер
              </h1>
              <p className="muted" style={{ fontSize: 16, lineHeight: 1.5, margin: '18px 8px 0', fontWeight: 500 }}>
                Персональная программа.<br />Умная аналитика. Твой прогресс.
              </p>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 60 }} />

          <div style={{ width: '100%' }}>
            <button className="cta block" onClick={onNext}>
              Начать
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)', margin: '16px 0 8px', fontWeight: 500 }}>
              Нажимая «Начать», ты принимаешь условия использования
            </p>
          </div>
        </div>
      </ScrollBody>
    </Screen>
  )
}
