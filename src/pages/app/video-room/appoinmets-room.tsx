"use client"

import { useState, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { getScheduledAppointment } from "@/api/get-scheduled-appointment"
import { AppointmentAddForm } from "./components/appointment-add-form"
import { VideoRoomMock } from "./components/video-room"
import { useHeaderStore } from "@/hooks/use-header-store"

export function AppointmentsRoom() {
    const { setTitle } = useHeaderStore()

    // --- ESTADOS DE CONTROLE ---
    const [selectedPatientId, setSelectedPatientId] = useState("")
    const [notes, setNotes] = useState("")
    const [isSessionActive, setIsSessionActive] = useState(false) // Controla o botão
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null) // Guarda o ID da sessão

    useEffect(() => {
        setTitle('Sala de Atendimento')
    }, [setTitle])

    // Busca o agendamento vinculado ao paciente selecionado
    const { data: activeAppointmentData } = useQuery({
        queryKey: ['activeAppointment', selectedPatientId],
        queryFn: () => getScheduledAppointment(selectedPatientId),
        enabled: !!selectedPatientId && !isSessionActive,
        retry: false,
    })

    const currentAppointmentId = activeAppointmentData?.appointmentId || "";

    // --- HANDLERS DE SESSÃO ---
    const handleSessionStarted = useCallback((sessionId: string) => {
        setCurrentSessionId(sessionId)
        setIsSessionActive(true)
    }, [])

    const handleSessionFinished = useCallback(() => {
        setIsSessionActive(false)
        setCurrentSessionId(null)
        setSelectedPatientId("")
        setNotes("")
    }, [])

    const MAX_LENGTH = 8000;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value.substring(0, MAX_LENGTH));
    };

    return (
        <>
            <Helmet title="Sala de Atendimento" />

            <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-1">
                    <VideoRoomMock />
                </div>

                <div className="grid grid-cols-1">
                    <AppointmentAddForm
                        selectedPatientId={selectedPatientId}
                        onSelectPatient={setSelectedPatientId}
                        currentAppointmentId={currentAppointmentId}
                        currentSessionId={currentSessionId} // Passa o ID real
                        isSessionActive={isSessionActive}   // Passa o estado real
                        onSessionStarted={handleSessionStarted}
                        onSessionFinished={handleSessionFinished}
                        notes={notes}
                    />
                </div>

                <Card className={`mt-2 transition-opacity ${!isSessionActive ? 'opacity-50' : 'opacity-100'}`}>
                    <CardHeader>
                        <CardTitle>Anotações e Evolução</CardTitle>
                        <CardDescription>Registre a evolução clínica durante o atendimento.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Textarea
                                id="notes"
                                placeholder="Adicione observações..."
                                value={notes}
                                onChange={handleNotesChange}
                                disabled={!isSessionActive}
                                rows={4}
                                className="w-full resize-none"
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {notes.length}/{MAX_LENGTH} caracteres
                            </div>
                        </div>

                        <Button
                            disabled={!notes.trim() || !isSessionActive}
                            className="w-full sm:w-auto"
                        >
                            Salvar Rascunho
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}