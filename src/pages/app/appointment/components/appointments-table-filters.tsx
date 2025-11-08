"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterAppointment } from "./register-appointment"

import type { Appointment } from "@/api/get-appointment"

export function AppointmentsTableFilters() {
    const [cpf, setCpf] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("all")

    const [isLoading, setIsLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [foundAppointments, setFoundAppointments] = useState<Appointment[]>([])

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCpf(value)
        if (value) setName("")
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setName(value)
        if (value) setCpf("")
    }

    useEffect(() => {
        const handleSearch = async () => {
            const searchCpf = cpf.trim()
            const searchName = name.trim()

            if (!searchCpf && !searchName) {
                setSearchError(null)
                setFoundAppointments([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setSearchError(null)
            setFoundAppointments([])

            try {
            } catch (error) {
                console.error(error)
                setSearchError("Erro ao buscar agendamentos. Tente novamente.")
                setFoundAppointments([])
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(() => {
            handleSearch()
        }, 500)

        return () => {
            clearTimeout(timer)
            setIsLoading(false)
        }
    }, [cpf, name])

    return (
        <div className="space-y-3">
            <div className="space-y-3">
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
                        <Input
                            placeholder="Buscar por CPF do paciente..."
                            value={cpf}
                            onChange={handleCpfChange}
                            className="h-9"
                        />

                        <Input
                            placeholder="Buscar por Nome do paciente..."
                            value={name}
                            onChange={handleNameChange}
                            className="h-9"
                        />

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Status da sessão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="SCHEDULED">Agendado</SelectItem>
                                <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                                <SelectItem value="COMPLETED">Concluído</SelectItem>
                                <SelectItem value="CANCELED">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
                            >
                                <CalendarPlus className="h-4 w-4" />
                                Novo agendamento
                            </Button>
                        </DialogTrigger>

                        <RegisterAppointment />
                    </Dialog>

                </div>
            </div>

            <div className="mt-4 text-sm">
                {isLoading && <p className="text-muted-foreground">Buscando...</p>}
                {searchError && <p className="text-red-500">{searchError}</p>}

                {!isLoading &&
                    !searchError &&
                    (cpf.trim() || name.trim()) &&
                    foundAppointments.length === 0 && (
                        <p className="text-yellow-500">Nenhum agendamento encontrado.</p>
                    )}

                {foundAppointments.length > 0 && (
                    <div className="space-y-2">
                        <p className="font-semibold">Agendamento(s) Encontrado(s):</p>
                        {foundAppointments.map((appt) => (
                            <div key={appt.id} className="p-3 border rounded-md bg-muted">
                                <p>
                                    Paciente: {appt.patientName ?? "—"}
                                </p>
                                <p>Psicólogo: {appt.psychologistId ?? "—"}</p>
                                <p>Diagnóstico: {appt.diagnosis ?? "—"}</p>
                                <p>Status: {appt.status}</p>
                                <p>
                                    Data:{" "}
                                    {new Date(appt.scheduledAt).toLocaleString("pt-BR", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
