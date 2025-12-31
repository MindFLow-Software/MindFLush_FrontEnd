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

interface GetProfileApiResponse {
  psychologist: GetProfileResponse
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get<GetProfileApiResponse>('/psychologist/me')
  const psychologist = response.data.psychologist

  if (psychologist) {
    const storedUser = localStorage.getItem('user')
    const currentUser = storedUser ? JSON.parse(storedUser) : {}

    const updatedUser = {
      ...currentUser,
      ...psychologist,
      role: psychologist.role
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return psychologist
}