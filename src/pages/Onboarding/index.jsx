import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Screen, ScrollBody, Pad, TgHeader } from '../../components/layout'
import { Icon } from '../../components/ui'
import { haptic } from '../../lib/telegram'
import Welcome from './Welcome'
import AboutYou from './AboutYou'
import GoalLevel from './GoalLevel'
import Generating from './Generating'

export default function Onboarding() {
  const [step, setStep] = useState(0) // 0=welcome, 1=about, 2=goal, 3=generating

  const next = () => { haptic('light'); setStep(s => s + 1) }
  const back = () => { haptic('light'); setStep(s => s - 1) }

  if (step === 0) return <Welcome onNext={next} />
  if (step === 1) return <AboutYou onNext={next} onBack={back} />
  if (step === 2) return <GoalLevel onNext={next} onBack={back} />
  if (step === 3) return <Generating />

  return null
}
