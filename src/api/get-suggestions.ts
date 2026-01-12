import { api } from "@/lib/axios"

export interface Suggestion {
  id: string
  title: string
  description: string
  category: "UI_UX" | "SCHEDULING" | "REPORTS" | "PRIVACY_LGPD" | "INTEGRATIONS" | "OTHERS"
  status: "PENDING" | "UNDER_REVIEW" | "IMPLEMENTED" | "REJECTED"
  likes: string[]
  likesCount: number
  psychologistName: string
  createdAt: string
  attachments: string[]
}

interface GetSuggestionsParams {
  category?: string
  status?: string
  sortBy?: string
}

export async function getSuggestions(params: GetSuggestionsParams) {
  const response = await api.get<{ suggestions: Suggestion[] }>("/suggestions", {
    params,
  })
  return response.data.suggestions
}