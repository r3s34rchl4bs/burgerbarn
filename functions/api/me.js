import { json } from './_shared/response.js'

export async function onRequestGet({ data }) {
  const { sub: id, name, email, role } = data.user
  return json({ id, name, email, role })
}
