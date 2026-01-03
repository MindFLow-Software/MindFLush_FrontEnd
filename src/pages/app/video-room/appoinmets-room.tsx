"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentAddForm } from "./components/appointment-add-form"
import { useHeaderStore } from "@/hooks/use-header-store"
import { SessionTimer } from "./components/SessionTimer"
import { FileText } from "lucide-react"

export function AppointmentsRoom() {
    const { setTitle } = useHeaderStore()

    const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
    const [notes, setNotes] = useState("")
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    useEffect(() => {
        setTitle("Sala de Atendimento")
    }, [setTitle])

    const currentAppointmentId = selectedAppointmentId

    const handleSessionStarted = useCallback((sessionId: string) => {
        setCurrentSessionId(sessionId)
        setIsSessionActive(true)
    }, [])

    const handleSessionFinished = useCallback(() => {
        setIsSessionActive(false)
        setCurrentSessionId(null)
        setSelectedAppointmentId("")
        setNotes("")
    }, [])

    const MAX_LENGTH = 8000
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value.substring(0, MAX_LENGTH))
    }

    return (
        <>
            <Helmet title="Sala de Atendimento" />

            <div className="flex flex-col gap-4 mt-6">
                <div className="flex justify-center">
                    <SessionTimer isActive={isSessionActive} />
                </div>

                <Card
                    className={`
                    transition-all duration-300 ease-in-out
                    ${!isSessionActive
                            ? "opacity-40 grayscale pointer-events-none"
                            : "opacity-100 shadow-sm border-primary/10"
                        }
                `}
                >
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <FileText
                                className={`h-5 w-5 transition-colors ${isSessionActive ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <CardTitle className="text-xl">Anotações da Sessão</CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                            {isSessionActive
                                ? "Registre os detalhes e evolução do atendimento"
                                : "Inicie uma sessão para registrar anotações"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="relative">
                            <Textarea
                                id="notes"
                                placeholder="Descreva os sintomas, observações, diagnóstico, tratamento e evolução do paciente..."
                                value={notes}
                                onChange={handleNotesChange}
                                disabled={!isSessionActive}
                                rows={8}
                                className="w-full resize-none bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-sm leading-relaxed"
                            />
                            <div
                                className={`
                                absolute bottom-3 right-3 
                                text-xs font-medium tabular-nums px-2 py-1 rounded-md
                                transition-colors
                                ${notes.length > MAX_LENGTH * 0.9
                                        ? "bg-amber-500/10 text-amber-600"
                                        : "bg-background/80 text-muted-foreground"
                                    }
                            `}
                            >
                                {notes.length.toLocaleString()}/{MAX_LENGTH.toLocaleString()}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={!notes.trim() || !isSessionActive}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                Salvar Rascunho
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <AppointmentAddForm
                    onSelectPatient={setSelectedAppointmentId}
                    currentAppointmentId={currentAppointmentId}
                    currentSessionId={currentSessionId}
                    isSessionActive={isSessionActive}
                    onSessionStarted={handleSessionStarted}
                    onSessionFinished={handleSessionFinished}
                    notes={notes}
                />


            </div>
        </>
    )
}
