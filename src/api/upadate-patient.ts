import { api } from "@/lib/axios"
import type { Gender } from "@/types/enum-gender"

// Você precisará definir o tipo Role se ele não estiver definido.
type Role = "PATIENT" | "ADMIN" | "DOCTOR" // Exemplo de definição

export interface UpdatePatientData {
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
    role?: Role
    isActive?: boolean 
}

export async function updatePatient({ id, ...data }: UpdatePatientData) {
    const formattedData = {
        ...data,
        dateOfBirth:
            data.dateOfBirth instanceof Date
                ? data.dateOfBirth.toISOString()
                : data.dateOfBirth,
    }

    const payload = Object.fromEntries(
        Object.entries(formattedData).filter(
            ([_, value]) => value !== undefined && value !== null
        )
    )

    const response = await api.put(`/patients/${id}`, payload)
    return response.data
}