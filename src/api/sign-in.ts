import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post('/session', { email, password })
  
  const { jwt } = response.data

  localStorage.setItem('token', jwt)

  api.defaults.headers.common.Authorization = `Bearer ${jwt}`

  return response.data
}