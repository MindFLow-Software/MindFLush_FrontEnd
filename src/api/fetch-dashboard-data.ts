import { api } from "@/lib/axios"

// --- Interfaces de Tipagem (Alinhadas ao Backend) ---

export interface Appointment {
    id: string
    patientId: string
    scheduledAt: string
    status: string
    // ... outros campos de Appointment
}

export type PatientGenderCount = {
    gender: string
    count: number
}[]

export type PatientsByAgeResponse = {
    ageRange: string
    patients: number
}[]

// Interface principal que mapeia o retorno consolidado do Controller
export interface DashboardData {
    totalPatients: number
    patientsByGender: PatientGenderCount
    patientsByAge: PatientsByAgeResponse
    upcomingAppointments: Appointment[] 
    newPatientsLast7Days: { date: string; newPatients: number }[] 
}

// Interface de Requisição (Aceita apenas datas opcionais)
export interface FetchDashboardParams {
    startDate?: Date 
    endDate?: Date
}

// --- Função da API ---

/**
 * Busca todos os dados consolidados para a dashboard do psicólogo logado.
 * @param params Datas de início e fim opcionais para o filtro do gráfico.
 */
export async function fetchDashboardData(
    params: FetchDashboardParams,
): Promise<DashboardData> {
    
    // Constrói os Query Parameters, serializando objetos Date para string ISO
    const queryParams = {
        // Usa operador ternário para garantir que os campos sejam omitidos se undefined
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
    }

    // Chama o endpoint GET /dashboard
    const response = await api.get<DashboardData>("/dashboard", {
        params: queryParams,
    })

    return response.data
}