import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

export const officialPortrait =
  /^https?:\/\/(?:www\.camara\.leg\.br\/internet\/deputado\/bandep\/\d+|www\.senado\.leg\.br\/senadores\/img\/fotos-oficiais\/senador\d+)\.jpg$/
export const portraitPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGTsAAAAASUVORK5CYII=',
  'base64',
)

// Every integrated page can display official photos, not just photos.spec.ts.
// Keep the whole suite independent of the government image host.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(officialPortrait, (route) =>
      route.fulfill({ status: 200, contentType: 'image/png', body: portraitPng }),
    )
    await use(context)
  },
})
