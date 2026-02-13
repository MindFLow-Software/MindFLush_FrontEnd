import { api } from "@/lib/axios"

export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null | undefined
  status?: string | null | undefined
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  cpf: string
  phoneNumber: string 
  gender: 'MASCULINE' | 'FEMININE' | 'OTHER'
  status: 'Ativo' | 'Inativo' // Normalizado para exibição
  isActive: boolean           // Fonte da verdade para lógica
  createdAt: string
  dateOfBirth: string 
  profileImageUrl: string | null
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
}: GetPatientsFilters): Promise<GetPatientsResponse> {
  
  const response = await api.get("/patients", { 
    params: {
      pageIndex,
      perPage,
      filter: filter || undefined,
      status: status === 'all' ? null : status, 
    },
  })

  // 🟢 Normalização idêntica ao PatientPresenter do Backend
  const normalizedPatients: Patient[] = response.data.patients.map((p: any) => {
    // Lida com estruturas DDD (.props) ou objetos planos
    const raw = p.props || p 
    
    // Define o booleano de atividade (prioriza isActive da API)
    const checkIsActive = raw.isActive === true || raw.status === 'active'

    return {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      // Garante que o nome concatenado sempre exista
      name: raw.name || `${raw.firstName} ${raw.lastName}`.trim() || "Paciente sem nome",
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      gender: raw.gender || 'OTHER',
      
      // 🟢 SINCRONIA TOTAL:
      isActive: checkIsActive,
      status: checkIsActive ? 'Ativo' : 'Inativo',
      
      createdAt: raw.createdAt,
      dateOfBirth: raw.dateOfBirth,
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null
    }
  })

  return {
    patients: normalizedPatients,
    meta: response.data.meta
  }
}