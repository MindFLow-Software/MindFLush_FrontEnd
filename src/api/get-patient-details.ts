import { api } from "@/lib/axios"

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    name: string // 🟢 Adicionado para consistência
    profileImageUrl: string | null
    cpf: string
    email: string
    phoneNumber: string
    status: 'active' | 'inactive'
    isActive: boolean // 🟢 Adicionado como fonte da verdade
    dateOfBirth: string | null 
    gender: 'MASCULINE' | 'FEMININE' | 'OTHER' | null
    sessions: Array<{
      id: string
      date: string
      sessionDate?: string | null
      createdAt: string
      theme: string
      duration: string
      status: string
      content: string | null
    }>
  }
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number
  }
}

export async function getPatientDetails(patientId: string, pageIndex: number): Promise<GetPatientDetailsResponse> {
  const response = await api.get<any>(`/patients/${patientId}/details`, {
    params: { pageIndex },
  })

  const p = response.data.patient
  const raw = p.props || p 

  // 🟢 Lógica de normalização idêntica à listagem e ao backend
  // Consideramos ativo se isActive for true OU se o status vier como 'active'
  const checkIsActive = raw.isActive === true || raw.status === 'active'

  return {
    ...response.data,
    patient: {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      // Nome concatenado para facilitar o uso no Header e Prontuário
      name: `${raw.firstName} ${raw.lastName}`.trim(),
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      
      // 🟢 SINCRONIA DE STATUS
      isActive: checkIsActive,
      status: checkIsActive ? 'active' : 'inactive',
      
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null,
      dateOfBirth: raw.dateOfBirth || raw.date_of_birth || null, 
      gender: raw.gender || null,
      sessions: raw.sessions || p.sessions || []
    }
  }
}