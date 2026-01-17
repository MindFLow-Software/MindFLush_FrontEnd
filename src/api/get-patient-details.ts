import { api } from "@/lib/axios"

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
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

export async function getPatientDetails(patientId: string, pageIndex: number) {
  const response = await api.get<GetPatientDetailsResponse>(
    `/patients/${patientId}/details`,
    {
      params: { pageIndex },
    }
  )

  return response.data
}