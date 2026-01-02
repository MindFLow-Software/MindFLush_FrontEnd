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
      theme: string
      duration: string
      status: 'Concluída' | 'Pendente'
    }>
  }
}

export async function getPatientDetails(patientId: string) {
  const response = await api.get<GetPatientDetailsResponse>(
    `/patients/${patientId}/details`
  )

  return response.data
}