export function requireLocal(url: string | undefined, name: string): string {
  if (!url) throw new Error(`${name}_REQUIRED`)
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url).hostname))
    throw new Error(`${name}_LOCAL_ONLY`)
  return url
}
