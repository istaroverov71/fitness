// Запусти этот скрипт на своём компьютере:
// node fetch-gifs.js
//
// Он сделает запросы к ExerciseDB и выведет обновлённый exercises.js

const API_KEY = 'cafde168efmsh18fb096c4bc75eep135529jsn39acc3292797'
const BASE = 'https://exercisedb.p.rapidapi.com'
const HEADERS = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
}

// Наши упражнения → поисковые запросы на английском
const SEARCH_MAP = [
  // Грудь
  { id: 'chest_1', query: 'dumbbell bench press' },
  { id: 'chest_2', query: 'incline dumbbell bench press' },
  { id: 'chest_3', query: 'dumbbell fly' },
  { id: 'chest_4', query: 'cable crossover' },
  { id: 'chest_5', query: 'pec deck fly' },
  { id: 'chest_6', query: 'smith machine bench press' },
  { id: 'chest_7', query: 'dumbbell pullover' },
  // Спина
  { id: 'back_1',  query: 'cable lat pulldown' },
  { id: 'back_2',  query: 'behind neck lat pulldown' },
  { id: 'back_3',  query: 'seated cable row' },
  { id: 'back_4',  query: 'dumbbell row' },
  { id: 'back_5',  query: 'barbell bent over row' },
  { id: 'back_6',  query: 'assisted pull up' },
  { id: 'back_7',  query: 'cable row standing' },
  // Ноги
  { id: 'legs_1',  query: 'leg press' },
  { id: 'legs_2',  query: 'leg extension' },
  { id: 'legs_3',  query: 'leg curl' },
  { id: 'legs_4',  query: 'smith machine squat' },
  { id: 'legs_5',  query: 'inner thigh adductor' },
  { id: 'legs_6',  query: 'hip abduction' },
  { id: 'legs_7',  query: 'dumbbell lunge' },
  // Плечи
  { id: 'shoulders_1', query: 'dumbbell shoulder press' },
  { id: 'shoulders_2', query: 'smith machine overhead press' },
  { id: 'shoulders_3', query: 'dumbbell lateral raise' },
  { id: 'shoulders_4', query: 'dumbbell rear delt fly' },
  { id: 'shoulders_5', query: 'barbell upright row' },
  // Бицепс
  { id: 'biceps_1', query: 'dumbbell curl' },
  { id: 'biceps_2', query: 'barbell curl' },
  { id: 'biceps_3', query: 'cable curl' },
  { id: 'biceps_4', query: 'hammer curl' },
  // Трицепс
  { id: 'triceps_1', query: 'cable tricep pushdown' },
  { id: 'triceps_2', query: 'dumbbell skull crusher' },
  { id: 'triceps_3', query: 'dips' },
  { id: 'triceps_4', query: 'cable overhead tricep extension' },
  // Пресс
  { id: 'abs_1', query: 'crunch' },
  { id: 'abs_2', query: 'cable crunch' },
  { id: 'abs_3', query: 'hanging leg raise' },
  { id: 'abs_4', query: 'kneeling cable crunch' },
  // Кардио
  { id: 'cardio_1', query: 'run' },
  { id: 'cardio_2', query: 'elliptical' },
  { id: 'cardio_3', query: 'rowing' },
]

async function fetchGif(query) {
  const url = `${BASE}/exercises/name/${encodeURIComponent(query)}?limit=3`
  const res = await fetch(url, { headers: HEADERS })
  const data = await res.json()
  if (data && data.length > 0) return data[0].gifUrl
  return null
}

async function main() {
  const results = {}

  for (const item of SEARCH_MAP) {
    try {
      const gif = await fetchGif(item.query)
      results[item.id] = gif || 'NOT_FOUND'
      console.error(`${item.id}: ${gif ? '✅' : '❌'} ${item.query}`)
      // небольшая пауза чтобы не превысить лимит
      await new Promise(r => setTimeout(r, 300))
    } catch (e) {
      results[item.id] = 'ERROR'
      console.error(`${item.id}: ❌ ERROR - ${e.message}`)
    }
  }

  // Выводим результат в формате для вставки в exercises.js
  console.log('\n\n// === GIF URLS — вставь в exercises.js ===')
  console.log('export const EXERCISE_GIFS = ' + JSON.stringify(results, null, 2))
}

main()
