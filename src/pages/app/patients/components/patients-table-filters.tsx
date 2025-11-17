"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { UserRoundPlus } from "lucide-react"

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
import { RegisterPatients } from "./register-patients"

import { getPatientByCpf, type Patient } from "@/api/get-patient-by-cpf"
import { getPatientsByName } from "@/api/get-patient-by-name"

export function PatientsTableFilters() {
    const [cpf, setCpf] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("all")

    const [isLoading, setIsLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [foundPatients, setFoundPatients] = useState<Patient[]>([])

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCpf(value)
        if (value) {
            setName("")
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setName(value)
        if (value) {
            setCpf("")
        }
    }

    useEffect(() => {
        const handleSearch = async () => {
            const searchCpf = cpf.trim()
            const searchName = name.trim()

            if (!searchCpf && !searchName) {
                setSearchError(null)
                setFoundPatients([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setSearchError(null)
            setFoundPatients([])

            try {
                if (searchCpf) {
                    const { patient } = await getPatientByCpf(searchCpf)
                    setFoundPatients(patient ? [patient] : [])
                } else if (searchName) {
                    const { patients } = await getPatientsByName(searchName)
                    setFoundPatients(patients)
                }
            } catch (error) {
                console.error(error)
                setSearchError(
                    "Erro ao buscar paciente. Verifique os dados ou tente novamente.",
                )
                setFoundPatients([])
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
                            placeholder="Digite o CPF do paciente..."
                            value={cpf}
                            onChange={handleCpfChange}
                            className="h-9"
                        />

                        <Input
                            placeholder="Digite o Nome do paciente..."
                            value={name}
                            onChange={handleNameChange}
                            className="h-9"
                        />

                        <Select value={status} onValueChange={setStatus} disabled>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="active">Em acompanhamento</SelectItem>
                                <SelectItem value="scheduled">Sessão agendada</SelectItem>
                                <SelectItem value="completed">Sessão concluída</SelectItem>
                                <SelectItem value="paused">Em pausa</SelectItem>
                                <SelectItem value="discharged">Alta terapêutica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
                            >
                                <UserRoundPlus className="h-4 w-4" />
                                Cadastrar paciente
                            </Button>
                        </DialogTrigger>
                        <RegisterPatients />
                    </Dialog>
                </div>
            </div>

            <div className="mt-4 text-sm">
                {isLoading && <p className="text-muted-foreground">Buscando...</p>}

                {searchError && <p className="text-red-500">{searchError}</p>}

                {!isLoading &&
                    !searchError &&
                    (cpf.trim() || name.trim()) &&
                    foundPatients.length === 0 && (
                        <p className="text-yellow-500">Nenhum paciente encontrado.</p>
                    )}

                {foundPatients.length > 0 && (
                    <div className="space-y-2">
                        <p className="font-semibold">Paciente(s) Encontrado(s):</p>
                        {foundPatients.map((patient) => (
                            <div key={patient.id} className="p-3 border rounded-md bg-muted">
                                <p>
                                    Nome: {patient.firstName} {patient.lastName}
                                </p>
                                <p>CPF: {patient.cpf}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}