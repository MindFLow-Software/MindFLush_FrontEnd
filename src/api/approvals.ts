// src/api/approvals.ts
import { api } from "@/lib/axios"

export interface PendingPsychologist {
  id: string
  firstName: string
  lastName: string
  email: string
  crp: string
  createdAt: string
}

export interface GetApprovalsResponse {
  psychologists: PendingPsychologist[]
}

export async function getPendingApprovals() {
  const response = await api.get<GetApprovalsResponse>('/approvals')
  return response.data
}

export async function approvePsychologist(psychologistId: string) {
  await api.patch(`/approvals/${psychologistId}/approve`)
}