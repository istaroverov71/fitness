const TOKEN = process.env.TELEGRAM_BOT_TOKEN

async function sendMessage(chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra,
    }),
  })
}

export default async function handler(req, res) {
  // Telegram sends POST, health-check is GET
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, hint: 'Webhook is alive' })
  }

  try {
    const update = req.body

    const message = update.message || update.edited_message
    if (!message) return res.status(200).json({ ok: true })

    const chatId = message.chat.id
    const text   = message.text ?? ''

    if (text.startsWith('/start')) {
      await sendMessage(
        chatId,
        '👋 Привет! Я <b>FitBot</b> — твой персональный фитнес тренер.\n\nОткрой приложение кнопкой <b>OPEN</b> рядом с моим именем в списке чатов 💪',
        // remove_keyboard clears the leftover persistent reply keyboard
        { reply_markup: { remove_keyboard: true } }
      )
    }
  } catch (err) {
    console.error('Webhook error:', err)
  }

  // Always return 200 so Telegram doesn't retry
  res.status(200).json({ ok: true })
}
