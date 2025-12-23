import { api } from "@/lib/axios"

interface FinishAppointmentSessionRequest {
  sessionId: string
  notes?: string
}

interface FinishAppointmentSessionResponse {
  message: string
  durationInMin: number
  endedAt: string
}

export async function finishAppointmentSession({
  sessionId,
  notes,
}: FinishAppointmentSessionRequest): Promise<FinishAppointmentSessionResponse> {
  const response = await api.post<FinishAppointmentSessionResponse>(
    `/sessions/${sessionId}/finish`,
    { notes }
  )

  return response.data
}