import { api } from "@/lib/axios"

export interface Patient {
  id: string
  firstName: string
  lastName: string
  cpf: string
  email?: string
  phoneNumber: string
  dateOfBirth: string | Date
  gender: "MASCULINE" | "FEMININE" | "OTHER"
  isActive?: boolean
  profileImageUrl?: string
}

export async function getPatientByCpf(cpf: string): Promise<Patient> {
  const cleanCpf = cpf.replace(/\D/g, "")

  const response = await api.get<{ patient: Patient }>(`/patients/${cleanCpf}`)
  return response.data.patient
}
