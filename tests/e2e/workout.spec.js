import { test, expect } from '@playwright/test'
import { mockTelegramWebApp, mockSupabase } from './helpers.js'

// Helper: complete onboarding and land on main screen
async function completeOnboarding(page) {
  await mockTelegramWebApp(page)
  await mockSupabase(page)
  await page.goto('/')

  await page.getByRole('button', { name: 'Начать' }).click()
  await page.getByPlaceholder('Введи имя').fill('Иван')
  await page.getByPlaceholder('28').fill('28')
  await page.getByPlaceholder('80').fill('82')
  await page.getByPlaceholder('180').fill('180')
  await page.getByRole('button', { name: 'Далее' }).click()
  await page.getByRole('button', { name: /Создать программу/ }).click()
  await expect(page.getByText('Следующая тренировка')).toBeVisible({ timeout: 8000 })
}

// ─── Home Dashboard ────────────────────────────────────────────────────────────

test('Home dashboard shows program hero card and upcoming workouts', async ({ page }) => {
  await completeOnboarding(page)

  await expect(page.getByText('Следующая тренировка')).toBeVisible()
  await expect(page.getByText('Следующие тренировки')).toBeVisible()
})

test('Clicking hero card opens exercise list', async ({ page }) => {
  await completeOnboarding(page)

  // Click the program card
  await page.locator('[style*="cursor: pointer"]').first().click()

  // Should show exercise list or day detail
  await expect(page.getByRole('button', { name: /Начать тренировку/ })).toBeVisible({ timeout: 4000 })
})

// ─── Exercise list ─────────────────────────────────────────────────────────────

test('Exercise list: back button returns to home', async ({ page }) => {
  await completeOnboarding(page)

  await page.locator('[style*="cursor: pointer"]').first().click()
  await expect(page.getByRole('button', { name: /Начать тренировку/ })).toBeVisible({ timeout: 4000 })

  await page.getByRole('button', { name: /Назад/ }).click()
  await expect(page.getByText('Следующая тренировка')).toBeVisible()
})

test('Start workout button launches active workout', async ({ page }) => {
  await completeOnboarding(page)

  await page.locator('[style*="cursor: pointer"]').first().click()
  await page.getByRole('button', { name: /Начать тренировку/ }).click()

  // Active workout screen should show + button for sets
  await expect(page.getByText(/Подход/)).toBeVisible({ timeout: 4000 })
})

// ─── Active workout ────────────────────────────────────────────────────────────

test('Can log a set and see it in done list', async ({ page }) => {
  await completeOnboarding(page)

  await page.locator('[style*="cursor: pointer"]').first().click()
  await page.getByRole('button', { name: /Начать тренировку/ }).click()

  // Click "Записать подход"
  const logBtn = page.getByRole('button', { name: /Записать/ })
  await expect(logBtn).toBeVisible({ timeout: 4000 })
  await logBtn.click()

  // A done-set entry should appear
  await expect(page.locator('.doneset').first()).toBeVisible({ timeout: 2000 })
})

// ─── Tab navigation ────────────────────────────────────────────────────────────

test('Tab bar: can navigate to Exercises tab', async ({ page }) => {
  await completeOnboarding(page)

  // Click exercises tab
  await page.getByText('Упражнения').click()
  await expect(page.getByText('Группы мышц')).toBeVisible({ timeout: 3000 })
})

test('Tab bar: can navigate to Analytics tab', async ({ page }) => {
  await completeOnboarding(page)

  await page.getByText('Аналитика').click()
  await expect(page.getByText('Обзор')).toBeVisible({ timeout: 3000 })
})
