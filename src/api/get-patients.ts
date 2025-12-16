import { api } from "@/lib/axios"

// Definição da interface de filtros
export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null | undefined
  status?: string | null | undefined
}

// Interface corrigida do Paciente
export interface Patient {
  id: string
  firstName: string
  lastName: string
  cpf: string
  email: string
  // 🐛 CORREÇÃO 1: Definindo phoneNumber como string (e não opcional) para evitar erro de tipagem.
  // Se o backend pode retornar undefined, mude para: phoneNumber: string | undefined
  phoneNumber: string 
  
  // 🐛 CORREÇÃO 2: Alterando 'MALE'/'FEMALE' para 'MASCULINE'/'FEMININE'
  // (Baseado na lógica genderConfig do seu componente PatientsTableRowItem)
  gender: 'MASCULINE' | 'FEMININE' | 'OTHER'
  
  status: 'Ativo' | 'Inativo' // Sugestão: tornar o status mais específico
  createdAt: string
  
  // 🐛 CORREÇÃO 3: ADICIONANDO 'dateOfBirth' (Propriedade ausente que causou o erro 2339)
  dateOfBirth: string // Supondo que a API retorna como string (ISO date ou similar)
}

export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getPatients({
  pageIndex,
  perPage,
  filter,
  status,
}: GetPatientsFilters) {
  const response = await api.get<GetPatientsResponse>("/patients", {
    params: {
      pageIndex,
      perPage,
      filter,
      status,
    },
  })

  return response.data
}