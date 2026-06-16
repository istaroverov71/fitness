const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const APP_URL = 'https://fitness-beta-sage.vercel.app'

async function sendMessage(chatId, text, replyMarkup) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
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
        '👋 Привет! Я <b>FitBot</b> — твой персональный фитнес тренер.\n\nНажми кнопку ниже чтобы открыть приложение 💪',
        {
          keyboard: [[
            { text: '💪 Открыть FitBot', web_app: { url: APP_URL } },
          ]],
          resize_keyboard: true,
          persistent: true,
        }
      )
    }
  } catch (err) {
    console.error('Webhook error:', err)
  }

  // Always return 200 so Telegram doesn't retry
  res.status(200).json({ ok: true })
}
