export const tg = window.Telegram?.WebApp

export function getTelegramUser() {
  if (!tg) return { id: 1, first_name: 'Dev', username: 'dev' }
  return tg.initDataUnsafe?.user || { id: 1, first_name: 'Dev', username: 'dev' }
}

export function expandTelegram() {
  tg?.expand()
  tg?.setHeaderColor('#0D0D0D')
  tg?.setBackgroundColor('#0D0D0D')
}

export function haptic(type = 'light') {
  tg?.HapticFeedback?.impactOccurred(type)
}
