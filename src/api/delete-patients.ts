import { api } from "@/lib/axios"

/**
 * Deleta um paciente pelo ID.
 * @param patientId - ID do paciente a ser excluído.
 */
export async function deletePatients(patientId: string) {
    const response = await api.delete(`/patient/${patientId}`)
    return response.data
}
