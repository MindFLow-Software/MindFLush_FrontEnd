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
  profileImageUrl: string | null
  crp: string | null
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get('/psychologist/me')
  
  const { psychologist: raw } = response.data

  const psychologist: GetProfileResponse = {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phoneNumber: raw.phoneNumber,
    cpf: raw.cpf,
    dateOfBirth: raw.dateOfBirth,
    role: raw.role,
    gender: raw.gender,
    expertise: raw.expertise,
    isActive: raw.isActive,
    crp: raw.crp,
    // ✅ Pega o ID que agora vem preenchido da API
    profileImageUrl: raw.profileImageUrl || null 
  }

  localStorage.setItem('user', JSON.stringify(psychologist))

  return psychologist
}