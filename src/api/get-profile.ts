// src/api/get-profile.ts

import { api } from '@/lib/axios'
import type { Gender } from '@/types/enum-gender'
import type { Expertise, PsychologistRole } from '@/types/expertise'

export interface GetProfileResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  cpf: string
  dateOfBirth: string
  role: PsychologistRole
  gender: Gender
  expertise: Expertise
  isActive: boolean
  profileImageUrl?: string
  crp?: string
}

// Interface para a resposta real da API, que vem aninhada
interface GetProfileApiResponse {
  psychologist: GetProfileResponse
}

export async function getProfile(): Promise<GetProfileResponse | null> {
  try {
    // 1. O 'get' agora espera a resposta aninhada
    const response = await api.get<GetProfileApiResponse>('/psychologist/me')
    
    // 2. Retornamos o objeto 'psychologist' de dentro da resposta
    return response.data.psychologist
  } catch (error: any) {
    console.error(
      'Erro ao buscar perfil do psicólogo:',
      error.response?.data || error.message,
    )
    return null
  }
}