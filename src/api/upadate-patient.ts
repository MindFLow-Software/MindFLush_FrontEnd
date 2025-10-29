import { api } from "@/lib/axios"
import type { Gender } from "@/types/enum-gender"

export interface UpdatePatientData {
    isActive: boolean
    id: string
    firstName?: string
    lastName?: string
    socialName?: string
    email?: string
    password?: string
    phoneNumber?: string
    profileImageUrl?: string
    dateOfBirth?: Date | string
    cpf?: string
    gender?: Gender
}

export async function updatePatient({ id, ...data }: UpdatePatientData) {
    const payload = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    const response = await api.put(`/patients/${id}`, payload)
    return response.data
}
