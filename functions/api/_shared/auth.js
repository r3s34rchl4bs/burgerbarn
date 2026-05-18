const enc = new TextEncoder()

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign', 'verify']
  )
}

export async function signToken(payload, secret, hoursValid = 168) {
  const now = Math.floor(Date.now() / 1000)
  const full = { ...payload, iat: now, exp: now + hoursValid * 3600 }
  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body   = b64url(enc.encode(JSON.stringify(full)))
  const data   = `${header}.${body}`
  const key    = await hmacKey(secret)
  const sig    = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return `${data}.${b64url(sig)}`
}

export async function verifyToken(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token format')
  const [header, body, sig] = parts
  const data    = `${header}.${body}`
  const key     = await hmacKey(secret)
  const sigBytes = Uint8Array.from(b64urlDecode(sig), c => c.charCodeAt(0))
  const valid   = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data))
  if (!valid) throw new Error('Invalid signature')
  const payload = JSON.parse(b64urlDecode(body))
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired')
  return payload
}

export function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k) out[k.trim()] = v.join('=').trim()
  }
  return out
}

export function setTokenCookie(token) {
  return `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 3600}`
}

export function clearTokenCookie() {
  return `token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
}
