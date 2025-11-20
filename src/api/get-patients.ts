import { api } from "@/lib/axios"
import { formatCPF } from "@/utils/formatCPF"

// Função formatPhone que você forneceu
export function formatPhone(raw: string): string {
  if (!raw) return raw
  const cleaned = String(raw).replace(/\D/g, '')

  // formato esperado: 11 dígitos (2 DDD + 9 número)
  if (/^(\d{2})(\d{5})(\d{4})$/.test(cleaned)) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  // tenta formatar 10 dígitos (caso número com 8 dígitos sem nono)
  if (/^(\d{2})(\d{4})(\d{4})$/.test(cleaned)) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }

  // se não bater, retorna só os números (fallback)
  return cleaned
}

export interface Patient {
    id: string
    firstName: string
    lastName: string
    email?: string
    cpf: string
    phoneNumber: string // ⬅️ Aplicaremos a formatação aqui
    profileImageUrl?: string
    dateOfBirth: string
    gender: "MASCULINE" | "FEMININE" | "OTHER"
    status?: string
}

export interface GetPatientsQuery { 
    pageIndex?: number
    perPage?: number
    name?: string | null
    cpf?: string | null 
    status?: string | null
}

export interface GetPatientsResponse {
    patients: Patient[]
    meta: {
        pageIndex: number
        perPage: number
        totalCount: number
    }
}

export async function getPatients(query: GetPatientsQuery): Promise<GetPatientsResponse> {
    const { pageIndex, perPage, name, cpf, status } = query 
    
    const response = await api.get<GetPatientsResponse>('/patients', {
        params: {
            pageIndex: pageIndex ?? 0,
            perPage: perPage ?? 10,
            name, 
            cpf,
            status: status === "all" ? null : status,
        },
    })

    const rawData = response.data

    const formattedPatients = rawData.patients.map(patient => ({
        ...patient,
        cpf: formatCPF(patient.cpf),
        phoneNumber: formatPhone(patient.phoneNumber), 
    }))

    return {
        ...rawData,
        patients: formattedPatients,
    }
}