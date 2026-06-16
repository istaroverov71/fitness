import { test, expect } from '@playwright/test'
import { mockTelegramWebApp, mockSupabase } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await mockTelegramWebApp(page)
  await mockSupabase(page)
})

// ─── Welcome screen ───────────────────────────────────────────────────────────

test('Welcome screen renders and "Начать" button is clickable', async ({ page }) => {
  await page.goto('/')

  const startBtn = page.getByRole('button', { name: 'Начать' })
  await expect(startBtn).toBeVisible()
  await expect(startBtn).toBeEnabled()
  await startBtn.click()

  // Should advance to "Расскажи о себе"
  await expect(page.getByText('Расскажи о себе')).toBeVisible()
})

// ─── AboutYou step ────────────────────────────────────────────────────────────

test('"Далее" is disabled until all fields are filled', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Начать' }).click()

  const next = page.getByRole('button', { name: 'Далее' })
  await expect(next).toBeDisabled()

  // Fill in name only — still disabled
  await page.getByPlaceholder('Введи имя').fill('Иван')
  await expect(next).toBeDisabled()
})

test('Full AboutYou form → "Далее" becomes enabled and advances', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Начать' }).click()

  await page.getByPlaceholder('Введи имя').fill('Иван')
  await page.getByPlaceholder('28').fill('28')
  await page.getByPlaceholder('80').fill('82')
  await page.getByPlaceholder('180').fill('180')

  const next = page.getByRole('button', { name: 'Далее' })
  await expect(next).toBeEnabled()
  await next.click()

  // Should advance to goal/level screen
  await expect(page.getByText('Твоя цель')).toBeVisible()
})

test('Sex toggle switches between Мужской and Женский', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Начать' }).click()

  const female = page.getByRole('button', { name: 'Женский' })
  await female.click()

  // Button should have the active class
  await expect(female).toHaveClass(/on/)
})

test('"Назад" on AboutYou returns to Welcome', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Начать' }).click()
  await expect(page.getByText('Расскажи о себе')).toBeVisible()

  await page.getByRole('button', { name: /Назад/ }).click()
  await expect(page.getByRole('button', { name: 'Начать' })).toBeVisible()
})

// ─── GoalLevel step ───────────────────────────────────────────────────────────

test('GoalLevel: can pick goal, level, days and generate program', async ({ page }) => {
  await page.goto('/')

  // Skip Welcome
  await page.getByRole('button', { name: 'Начать' }).click()

  // Fill AboutYou
  await page.getByPlaceholder('Введи имя').fill('Иван')
  await page.getByPlaceholder('28').fill('28')
  await page.getByPlaceholder('80').fill('82')
  await page.getByPlaceholder('180').fill('180')
  await page.getByRole('button', { name: 'Далее' }).click()

  // GoalLevel
  await expect(page.getByText('Твоя цель')).toBeVisible()

  // Pick "Похудение"
  await page.getByText('Похудение').click()

  // Pick level "Новичок"
  await page.getByText('Новичок').click()

  // Click "Создать программу"
  const generate = page.getByRole('button', { name: /Создать программу/ })
  await expect(generate).toBeEnabled()
  await generate.click()

  // Should show generating screen
  await expect(page.getByText('Создаём программу')).toBeVisible()
})

// ─── Full onboarding flow ─────────────────────────────────────────────────────

test('Complete onboarding → lands on main workout screen', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Начать' }).click()

  await page.getByPlaceholder('Введи имя').fill('Иван')
  await page.getByPlaceholder('28').fill('28')
  await page.getByPlaceholder('80').fill('82')
  await page.getByPlaceholder('180').fill('180')
  await page.getByRole('button', { name: 'Далее' }).click()

  await page.getByRole('button', { name: /Создать программу/ }).click()

  // Wait for program generation (local, fast)
  await expect(page.getByText('Следующая тренировка')).toBeVisible({ timeout: 8000 })
})
