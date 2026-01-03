"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { User, Loader2, Clock, Calendar, CheckCircle2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO, isToday, differenceInMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { startAppointmentSession } from "@/api/start-appointment-session"
import { finishAppointmentSession } from "@/api/finish-appointment-session"
import { toast } from "sonner"
import { getActiveAppointmentsGrouped } from "@/api/get-active-appointments-grouped"

interface AppointmentAddFormProps {
  onSelectPatient: (appointmentId: string) => void
  currentAppointmentId: string
  currentSessionId: string | null
  onSessionStarted: (sessionId: string) => void
  onSessionFinished: () => void
  isSessionActive: boolean
  notes?: string
}

export function AppointmentAddForm({
  onSelectPatient,
  currentAppointmentId,
  currentSessionId,
  onSessionStarted,
  onSessionFinished,
  isSessionActive,
  notes,
}: AppointmentAddFormProps) {
  const queryClient = useQueryClient()

  const { data: groupedData, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ["active-appointments-grouped"],
    queryFn: getActiveAppointmentsGrouped,
    staleTime: 1000 * 60,
  })

  const getCanStartInfo = () => {
    if (isSessionActive || !currentAppointmentId) return { canStart: true, message: "" }

    const allApps = Object.values(groupedData?.grouped || {}).flat()
    const selectedApp = allApps.find((app) => app.id === currentAppointmentId)

    if (!selectedApp) return { canStart: false, message: "" }

    const now = new Date()
    const scheduledAt = parseISO(selectedApp.scheduledAt)
    const diff = differenceInMinutes(scheduledAt, now)

    return {
      canStart: diff <= 10,
      message: diff > 10 ? `Disponível em ${diff - 10} min` : "",
    }
  }

  const { canStart, message } = getCanStartInfo()

  const { mutateAsync: startSessionFn, isPending: isStarting } = useMutation({
    mutationFn: startAppointmentSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-appointments-grouped"] })
      onSessionStarted(data.sessionId)
      toast.success("Atendimento iniciado")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao iniciar sessão")
    },
  })

  const { mutateAsync: finishSessionFn, isPending: isFinishing } = useMutation({
    mutationFn: finishAppointmentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-appointments-grouped"] })
      onSessionFinished()
      toast.success("Atendimento finalizado")
    },
    onError: () => toast.error("Erro ao finalizar atendimento"),
  })

  async function handleAction() {
    if (isSessionActive) {
      if (!currentSessionId) return toast.error("ID da sessão não encontrado")
      await finishSessionFn({ sessionId: currentSessionId, notes })
    } else {
      if (!currentAppointmentId) return toast.error("Selecione um agendamento")
      await startSessionFn({ appointmentId: currentAppointmentId })
    }
  }

  const isPending = isStarting || isFinishing

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2.5">
          {isSessionActive ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700">Sessão em Andamento</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 text-primary/70" />
              <span>Atendimento</span>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Select Patient */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <User className="w-4 h-4" />
            Paciente
          </label>
          <Select
            value={currentAppointmentId}
            onValueChange={onSelectPatient}
            disabled={isAppointmentsLoading || isPending || isSessionActive}
          >
            <SelectTrigger className="h-11 border-border/60 hover:border-border transition-colors">
              <SelectValue placeholder="Selecione o paciente..." />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {Object.entries(groupedData?.grouped || {}).map(([date, appointments]) => (
                <SelectGroup key={date}>
                  <SelectLabel className="text-xs font-semibold text-primary uppercase tracking-wide py-2 sticky top-0 backdrop-blur">
                    {format(parseISO(date), "EEEE, dd/MM", { locale: ptBR })}
                    {isToday(parseISO(date)) && (
                      <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full normal-case">
                        Hoje
                      </span>
                    )}
                  </SelectLabel>
                  {appointments.map((app) => (
                    <SelectItem key={app.id} value={app.id} className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{app.patientName}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-mono text-sm font-semibold">
                            {format(parseISO(app.scheduledAt), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
              {Object.keys(groupedData?.grouped || {}).length === 0 && !isAppointmentsLoading && (
                <div className="p-6 text-center text-sm text-muted-foreground">Nenhum agendamento encontrado</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Status Message */}
        {!isSessionActive && currentAppointmentId && !canStart && (
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200/60 rounded-lg">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">{message}</p>
              <p className="text-xs text-amber-700/80 mt-0.5">Liberação 10 minutos antes do horário</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAction}
          disabled={isPending || (!isSessionActive && (!currentAppointmentId || !canStart))}
          variant={isSessionActive ? "default" : "default"}
          className={`w-full h-11 font-medium transition-all ${isSessionActive ? "bg-green-600 hover:bg-green-700 text-white" : "shadow-sm"
            }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSessionActive ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Finalizar Atendimento
            </>
          ) : (
            <>Iniciar Atendimento</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
