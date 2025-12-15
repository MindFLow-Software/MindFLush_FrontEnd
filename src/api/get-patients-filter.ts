import { api } from "@/lib/axios"
import type { Expertise, PatientRole } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

export interface Patient {
    id: string
    firstName: string
    lastName: string
    email?: string
    phoneNumber: string
    profileImageUrl?: string
    dateOfBirth: string
    cpf: string
    role: PatientRole
    gender: Gender
    expertise: Expertise
    isActive?: boolean
    status?: string
    createdAt: string
}

export interface FetchPatientsQuery {
    pageIndex?: number
    perPage?: number
    search?: string | null
    status?: string | null
}

export interface FetchPatientsResponse {
    patients: Patient[]
    meta: {
        pageIndex: number
        perPage: number
        totalCount: number
    }
}

export async function fetchPatients({
    pageIndex = 0,
    perPage = 10,
    search,
    status,
}: FetchPatientsQuery): Promise<FetchPatientsResponse> {
    const isCpf = search && /\d/.test(search)

    const response = await api.get<FetchPatientsResponse>('/patients', {
        params: {
            pageIndex,
            perPage,
            status,
            cpf: isCpf ? search : undefined,
            name: !isCpf ? search : undefined,
        },
    })

    return response.data
}