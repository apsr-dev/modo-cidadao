import { publicEnvSchema } from '@civica/contracts'
export const publicEnv = publicEnvSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
})
export function metadata(title: string, description: string, path: string) {
  return {
    meta: [
      { title: `${title} · ${publicEnv.VITE_APP_NAME}` },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: new URL(path, publicEnv.VITE_APP_URL).href }],
  }
}
