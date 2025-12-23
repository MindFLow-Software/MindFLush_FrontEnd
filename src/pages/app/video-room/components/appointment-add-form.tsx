"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Loader2, StopCircle, CalendarCheck } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { getPatients } from "@/api/get-patients" // Volta para a API antiga
import { startAppointmentSession } from "@/api/start-appointment-session"
import { finishAppointmentSession } from "@/api/finish-appointment-session"
import { toast } from "sonner"

interface AppointmentAddFormProps {
  selectedPatientId: string
  onSelectPatient: (patientId: string) => void
  currentAppointmentId: string
  currentSessionId: string | null
  onSessionStarted: (sessionId: string) => void
  onSessionFinished: () => void
  isSessionActive: boolean
  notes?: string
}

export function AppointmentAddForm({
  selectedPatientId,
  onSelectPatient,
  currentAppointmentId,
  currentSessionId,
  onSessionStarted,
  onSessionFinished,
  isSessionActive,
  notes,
}: AppointmentAddFormProps) {
  const queryClient = useQueryClient()

  // Mutações
  const { mutateAsync: startSessionFn, isPending: isStarting } = useMutation({
    mutationFn: startAppointmentSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      onSessionStarted(data.sessionId)
      toast.success("Atendimento iniciado!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao iniciar sessão.")
    }
  })

  const { mutateAsync: finishSessionFn, isPending: isFinishing } = useMutation({
    mutationFn: finishAppointmentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      onSessionFinished()
      toast.success("Atendimento finalizado com sucesso.")
    },
    onError: () => toast.error("Erro ao finalizar atendimento.")
  })

  // Busca TODOS os pacientes (Versão Antiga)
  const { data: responseData, isLoading: isPatientsLoading } = useQuery({
    queryKey: ["all-psychologist-patients"],
    queryFn: () => getPatients({ pageIndex: 0, perPage: 999, filter: null }),
    staleTime: 1000 * 60 * 5,
  })

  const patientOptions = useMemo(() => {
    return responseData?.patients?.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
    })) ?? []
  }, [responseData])

  async function handleAction() {
    if (isSessionActive) {
      if (!currentSessionId) return toast.error("ID da sessão não encontrado.")
      await finishSessionFn({ sessionId: currentSessionId, notes })
    } else {
      if (!currentAppointmentId) return toast.error("Selecione um paciente com agendamento.")
      await startSessionFn({ appointmentId: currentAppointmentId })
    }
  }

  const isPending = isStarting || isFinishing

  return (
    <Card className={`transition-all ${isSessionActive ? 'border-destructive/50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSessionActive ? (
            <span className="text-destructive flex items-center gap-2 animate-pulse">
              <StopCircle className="w-5 h-5" /> Sessão Ativa
            </span>
          ) : (
            <><CalendarCheck className="w-5 h-5 text-primary" /> Iniciar Atendimento</>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Paciente</label>
          <Select
            value={selectedPatientId}
            onValueChange={onSelectPatient}
            disabled={isSessionActive || isPatientsLoading || isPending}
          >
            <SelectTrigger>
              {isPatientsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4 opacity-50" />}
              <SelectValue placeholder="Selecione um paciente..." />
            </SelectTrigger>
            <SelectContent>
              {patientOptions.map((item) => (
                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAction}
          disabled={isPending || (!isSessionActive && !selectedPatientId)}
          variant={isSessionActive ? "destructive" : "default"}
          className="w-full gap-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isSessionActive ? "Finalizar Atendimento" : "Iniciar Sessão"}
        </Button>
      </CardContent>
    </Card>
  )
}