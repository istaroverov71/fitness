// Inject a fake Telegram.WebApp before each test so the app boots
export async function mockTelegramWebApp(page) {
  await page.addInitScript(() => {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        expand: () => {},
        close: () => {},
        HapticFeedback: { impactOccurred: () => {}, notificationOccurred: () => {} },
        initData: '',
        initDataUnsafe: {
          user: { id: 999999, first_name: 'TestUser', username: 'testuser' },
        },
        colorScheme: 'dark',
        themeParams: {},
        isExpanded: true,
        viewportHeight: 844,
        MainButton: { show: () => {}, hide: () => {}, setText: () => {}, onClick: () => {} },
      },
    }
  })
}

// Stub all fetch calls to Supabase so tests don't need a real DB
export async function mockSupabase(page) {
  await page.route('**/supabase.co/**', async route => {
    const url = route.request().url()

    // loadOrCreateUser → return a user row
    if (url.includes('/users')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),  // empty = no existing user → will try to insert
      })
      return
    }

    // saveProfile / upsert
    if (url.includes('/rest/v1/')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      return
    }

    // rpc set_config
    if (url.includes('/rpc/')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: 'null' })
      return
    }

    await route.continue()
  })
}
