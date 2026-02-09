import { api } from "@/lib/axios"

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl: string | null
    cpf: string
    email: string
    phoneNumber: string
    status: 'active' | 'inactive'
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

  return {
    ...response.data,
    patient: {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      status: raw.isActive === false ? 'inactive' : 'active',
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null,
      sessions: raw.sessions || p.sessions || []
    }
  }
}