// Запусти: node fetch-gifs.js
// Использует bodyPart endpoint вместо name-поиска

const API_KEY = 'cafde168efmsh18fb096c4bc75eep135529jsn39acc3292797'
const BASE = 'https://exercisedb.p.rapidapi.com'
const HEADERS = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
}

// ExerciseDB bodyPart names
const BODY_PARTS = ['chest', 'back', 'upper legs', 'shoulders', 'upper arms', 'waist', 'cardio']

async function fetchByBodyPart(part) {
  const url = `${BASE}/exercises/bodyPart/${encodeURIComponent(part)}?limit=100&offset=0`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) {
    const text = await res.text()
    console.error(`Error ${res.status} for ${part}: ${text.slice(0, 200)}`)
    return []
  }
  return res.json()
}

// Ищем лучшее совпадение по ключевым словам
function findBest(exercises, keywords) {
  const kw = keywords.toLowerCase().split(' ')
  let best = null, bestScore = -1
  for (const ex of exercises) {
    const name = ex.name.toLowerCase()
    const score = kw.filter(k => name.includes(k)).length
    if (score > bestScore) { bestScore = score; best = ex }
  }
  return best
}

const WANT = [
  // Грудь
  { id: 'chest_1', part: 'chest',      kw: 'dumbbell bench press horizontal' },
  { id: 'chest_2', part: 'chest',      kw: 'incline dumbbell bench press' },
  { id: 'chest_3', part: 'chest',      kw: 'dumbbell fly chest' },
  { id: 'chest_4', part: 'chest',      kw: 'cable crossover fly' },
  { id: 'chest_5', part: 'chest',      kw: 'pec deck fly machine' },
  { id: 'chest_6', part: 'chest',      kw: 'smith machine bench press chest' },
  { id: 'chest_7', part: 'chest',      kw: 'dumbbell pullover' },
  // Спина
  { id: 'back_1',  part: 'back',       kw: 'cable lat pulldown' },
  { id: 'back_2',  part: 'back',       kw: 'behind neck lat pulldown' },
  { id: 'back_3',  part: 'back',       kw: 'seated cable row' },
  { id: 'back_4',  part: 'back',       kw: 'dumbbell one arm row' },
  { id: 'back_5',  part: 'back',       kw: 'barbell bent over row' },
  { id: 'back_6',  part: 'back',       kw: 'assisted pull up' },
  { id: 'back_7',  part: 'back',       kw: 'cable row standing' },
  // Ноги
  { id: 'legs_1',  part: 'upper legs', kw: 'leg press machine' },
  { id: 'legs_2',  part: 'upper legs', kw: 'leg extension' },
  { id: 'legs_3',  part: 'upper legs', kw: 'leg curl lying' },
  { id: 'legs_4',  part: 'upper legs', kw: 'smith machine squat' },
  { id: 'legs_5',  part: 'upper legs', kw: 'inner thigh adductor machine' },
  { id: 'legs_6',  part: 'upper legs', kw: 'hip abduction machine' },
  { id: 'legs_7',  part: 'upper legs', kw: 'dumbbell lunge' },
  // Плечи
  { id: 'shoulders_1', part: 'shoulders', kw: 'dumbbell shoulder press seated' },
  { id: 'shoulders_2', part: 'shoulders', kw: 'smith machine overhead press' },
  { id: 'shoulders_3', part: 'shoulders', kw: 'dumbbell lateral raise' },
  { id: 'shoulders_4', part: 'shoulders', kw: 'dumbbell rear delt fly bent' },
  { id: 'shoulders_5', part: 'shoulders', kw: 'barbell upright row' },
  // Бицепс
  { id: 'biceps_1', part: 'upper arms', kw: 'dumbbell curl standing' },
  { id: 'biceps_2', part: 'upper arms', kw: 'barbell curl' },
  { id: 'biceps_3', part: 'upper arms', kw: 'cable curl' },
  { id: 'biceps_4', part: 'upper arms', kw: 'hammer curl dumbbell' },
  // Трицепс
  { id: 'triceps_1', part: 'upper arms', kw: 'cable pushdown tricep' },
  { id: 'triceps_2', part: 'upper arms', kw: 'dumbbell skull crusher' },
  { id: 'triceps_3', part: 'upper arms', kw: 'dip tricep' },
  { id: 'triceps_4', part: 'upper arms', kw: 'cable overhead tricep extension' },
  // Пресс
  { id: 'abs_1', part: 'waist', kw: 'crunch' },
  { id: 'abs_2', part: 'waist', kw: 'cable crunch kneeling' },
  { id: 'abs_3', part: 'waist', kw: 'hanging leg raise' },
  { id: 'abs_4', part: 'waist', kw: 'cable crunch' },
  // Кардио
  { id: 'cardio_1', part: 'cardio', kw: 'run treadmill' },
  { id: 'cardio_2', part: 'cardio', kw: 'elliptical' },
  { id: 'cardio_3', part: 'cardio', kw: 'rowing' },
]

async function main() {
  // Загружаем все упражнения по группам (один раз)
  const cache = {}
  for (const part of BODY_PARTS) {
    process.stderr.write(`Fetching ${part}... `)
    cache[part] = await fetchByBodyPart(part)
    process.stderr.write(`${cache[part].length} exercises\n`)
    await new Promise(r => setTimeout(r, 500))
  }

  const results = {}
  for (const item of WANT) {
    const pool = cache[item.part] || []
    const match = findBest(pool, item.kw)
    if (match) {
      results[item.id] = match.gifUrl
      console.error(`${item.id}: ✅ "${match.name}"`)
    } else {
      results[item.id] = 'NOT_FOUND'
      console.error(`${item.id}: ❌ no match for "${item.kw}"`)
    }
  }

  console.log('\nexport const EXERCISE_GIFS = ' + JSON.stringify(results, null, 2))
}

main().catch(console.error)
