import { api } from "@/lib/axios"

type GetAmountPatientsResponse = {
  total: number
}

export async function getAmountPatients(): Promise<GetAmountPatientsResponse> {
  try {
    const response = await api.get<GetAmountPatientsResponse>("/patients/amount")
    return response.data
  } catch (error) {
    console.error("Erro ao buscar total de pacientes:", error)
    throw error
  }
}
