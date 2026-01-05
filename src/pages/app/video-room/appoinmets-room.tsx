"use client"

import { useState, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"

import { AppointmentAddForm } from "./components/appointment-add-form"
import { SessionTimer } from "./components/SessionTimer"
import { SessionNotesCard } from "./components/session-notes-card"
import { useHeaderStore } from "@/hooks/use-header-store"

export function AppointmentsRoom() {
    const { setTitle } = useHeaderStore()

    const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
    const [notes, setNotes] = useState("")
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    useEffect(() => {
        setTitle("Sala de Atendimento")
    }, [setTitle])

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

    const handleSaveDraft = () => {
        console.log("Rascunho salvo:", notes)
    }

    return (
        <>
            <Helmet title="Sala de Atendimento" />

            <div className="flex flex-col gap-4 mt-6">
                <div className="flex justify-center">
                    <SessionTimer isActive={isSessionActive} />
                </div>

                <SessionNotesCard
                    notes={notes}
                    isSessionActive={isSessionActive}
                    onNotesChange={setNotes}
                    onSaveDraft={handleSaveDraft}
                    maxLength={8000}
                />

                <AppointmentAddForm
                    onSelectPatient={setSelectedAppointmentId}
                    currentAppointmentId={selectedAppointmentId}
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