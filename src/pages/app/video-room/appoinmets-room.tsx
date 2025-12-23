"use client"

import { useState, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getScheduledAppointment } from "@/api/get-scheduled-appointment"
import { AppointmentAddForm } from "./components/appointment-add-form"
import { useHeaderStore } from "@/hooks/use-header-store"
import { SessionTimer } from "./components/SessionTimer"

export function AppointmentsRoom() {
    const { setTitle } = useHeaderStore()

    const [selectedPatientId, setSelectedPatientId] = useState("")
    const [notes, setNotes] = useState("")
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    useEffect(() => {
        setTitle('Sala de Atendimento')
    }, [setTitle])

    const { data: activeAppointmentData } = useQuery({
        queryKey: ['activeAppointment', selectedPatientId],
        queryFn: () => getScheduledAppointment(selectedPatientId),
        enabled: !!selectedPatientId && !isSessionActive,
        retry: false,
    })

    const currentAppointmentId = activeAppointmentData?.appointmentId || "";

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

                {/* <div className="grid grid-cols-1">
                    <VideoRoomMock />
                </div> */}
                <div >
                    <SessionTimer isActive={isSessionActive} />
                </div>
                <div className="grid grid-cols-1">
                    <AppointmentAddForm
                        selectedPatientId={selectedPatientId}
                        onSelectPatient={setSelectedPatientId}
                        currentAppointmentId={currentAppointmentId}
                        currentSessionId={currentSessionId}
                        isSessionActive={isSessionActive}
                        onSessionStarted={handleSessionStarted}
                        onSessionFinished={handleSessionFinished}
                        notes={notes}
                    />
                </div>

                <Card className={`mt-2 transition-all duration-300 ${!isSessionActive ? 'opacity-50 pointer-events-none' : 'opacity-100 ring-1 ring-primary/20'}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Anotações e Evolução</CardTitle>
                            <CardDescription>O histórico é registrado automaticamente ao finalizar.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Textarea
                                id="notes"
                                placeholder="Descreva aqui os detalhes da sessão..."
                                value={notes}
                                onChange={handleNotesChange}
                                disabled={!isSessionActive}
                                rows={6}
                                className="w-full resize-none bg-background focus-visible:ring-primary"
                            />
                            <div className="text-xs text-muted-foreground text-right tabular-nums">
                                {notes.length.toLocaleString()}/{MAX_LENGTH.toLocaleString()} caracteres
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                disabled={!notes.trim() || !isSessionActive}
                                className="text-xs"
                            >
                                Rascunho Temporário
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}