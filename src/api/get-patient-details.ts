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
      theme: string // 🔹 Este campo mapeia para o 'diagnosis' do backend
      duration: string
      status: 'Concluída' | 'Pendente' // 🔹 Status formatado pelo backend
    }>
  }
}

/**
 * Busca os detalhes completos do paciente.
 * A rota /details no backend já deve retornar o objeto formatado
 * com o diagnóstico (diagnosis) mapeado para tema (theme).
 */
export async function getPatientDetails(patientId: string) {
  const response = await api.get<GetPatientDetailsResponse>(
    `/patients/${patientId}/details`
  )

  return response.data
}