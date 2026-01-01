"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { getPatientDetails } from "@/api/get-patient-details"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

interface PatientsDetailsProps {
    patientId: string
}

const getStatusBadge = (status: string, hasPendingSession: boolean) => {
    if (hasPendingSession) {
        return { color: "bg-yellow-400", label: "Sessão pendente" }
    }
    switch (status) {
        case "active":
            return { color: "bg-green-500", label: "Ativo" }
        case "inactive":
            return { color: "bg-red-500", label: "Inativo" }
        default:
            return { color: "bg-gray-400", label: "Status Desconhecido" }
    }
}

export function PatientsDetails({ patientId }: PatientsDetailsProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["patient-details", patientId],
        queryFn: () => getPatientDetails(patientId),
        enabled: !!patientId,
    })

    if (isLoading || !data) {
        return (
            <DialogContent className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </DialogContent>
        )
    }

    const { patient } = data
    const totalSessions = patient.sessions.length
    const hasPending = patient.sessions.some((s: any) => s.status === "Pendente")
    const overallStatus = getStatusBadge(patient.status, hasPending)

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>
                    Paciente: {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription>
                    Detalhes do paciente e histórico de sessões
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                {/* Tabela de Detalhes do Paciente (Layout Antigo) */}
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Sessão</TableCell>
                            <TableCell className="flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${overallStatus.color}`} />
                                    <span className="font-medium text-muted-foreground">
                                        {overallStatus.label}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Nome completo</TableCell>
                            <TableCell className="flex justify-end font-medium">
                                {patient.firstName} {patient.lastName}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">CPF</TableCell>
                            <TableCell className="flex justify-end">
                                {formatCPF(patient.cpf)}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end">
                                {patient.email}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end">
                                {formatPhone(patient.phoneNumber)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Tabela de Histórico de Sessões (Layout Antigo) */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tema da Sessão</TableHead>
                            <TableHead className="text-right">Duração</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {patient.sessions.length > 0 ? (
                            patient.sessions.map((session: any) => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.date}</TableCell>
                                    <TableCell>{session.theme}</TableCell>
                                    <TableCell className="text-right">{session.duration}</TableCell>
                                    <TableCell
                                        className={`text-right ${session.status === "Concluída"
                                                ? "text-green-500"
                                                : "text-yellow-500"
                                            }`}
                                    >
                                        {session.status}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Nenhuma sessão registrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total de sessões</TableCell>
                            <TableCell className="text-right font-medium">
                                {totalSessions}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DialogContent>
    )
}