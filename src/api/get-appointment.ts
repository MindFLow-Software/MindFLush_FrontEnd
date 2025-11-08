import { api } from "@/lib/axios"

// Objeto de status alinhado com o enum do backend
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
} as const

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

export interface Appointment {
  patientName: string
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  status: AppointmentStatus

  patient: {
    firstName: string
    lastName: string
  }
  
}

export async function getAppointments(): Promise<Appointment[]> {
  // O tipo genérico <Appointment[]> agora bate com a resposta
  const response = await api.get<Appointment[]>("/appointments")
  console.log(response.data)
  return response.data
}