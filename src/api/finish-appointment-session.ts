import { api } from '@/lib/axios'

interface FinishAppointmentSessionRequest {
  sessionId: string
  notes?: string
}

export async function finishAppointmentSession({ 
  sessionId, 
  notes 
}: FinishAppointmentSessionRequest) {
  await api.post(`/sessions/${sessionId}/finish`, { notes })
}