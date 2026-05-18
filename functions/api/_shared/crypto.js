const enc = new TextEncoder()
const toHex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    key, 256
  )
  return `${toHex(salt)}:${toHex(hash)}`
}

export async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':')
  const salt = Uint8Array.from(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)))
  const key  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    key, 256
  )
  return toHex(hash) === hashHex
}
