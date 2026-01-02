"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2, ClockIcon } from "lucide-react"
import { getPatientDetails } from "@/api/get-patient-details"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

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

    const finishedSessions = patient.sessions.filter((s: any) => s.status === "Concluída")
    const totalSessions = patient.sessions.length

    const averageDuration = finishedSessions.length > 0
        ? Math.round(
            finishedSessions.reduce((acc: number, session: any) => {
                const minutes = parseInt(session.duration) || 0
                return acc + minutes
            }, 0) / finishedSessions.length
        )
        : 0

    const hasPending = patient.sessions.some((s: any) => s.status === "Pendente")
    const overallStatus = getStatusBadge(patient.status, hasPending)

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    Paciente: {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription>
                    Detalhes do paciente e histórico de sessões
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
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
                            <TableCell className="flex justify-end font-medium tabular-nums">
                                {formatCPF(patient.cpf)}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end font-medium">
                                {patient.email}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end font-medium tabular-nums">
                                {formatPhone(patient.phoneNumber)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Item
                    variant="outline"
                    className="bg-sky-50/50 border-sky-200 dark:bg-sky-950/10 dark:border-sky-900"
                >
                    <ItemMedia variant="icon" className="text-sky-600 dark:text-sky-500">
                        <ClockIcon className="h-5 w-5" />
                    </ItemMedia>

                    <ItemContent>
                        <ItemTitle>Tempo médio de atendimento</ItemTitle>
                        <ItemDescription>
                            Média baseada nos atendimentos realizados
                        </ItemDescription>
                    </ItemContent>

                    <ItemActions>
                        <div className="text-right">
                            <span className="text-lg font-semibold text-sky-700 dark:text-sky-400">
                                {averageDuration} min
                            </span>
                            <p className="text-xs text-muted-foreground">
                                por sessão
                            </p>
                        </div>
                    </ItemActions>
                </Item>

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
                                    <TableCell className="whitespace-nowrap">{session.date}</TableCell>
                                    <TableCell className="max-w-[200px] truncate italic text-muted-foreground">
                                        {session.theme}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right tabular-nums ${session.duration.includes('Aguardando')
                                                ? 'text-muted-foreground italic text-[11px]'
                                                : 'font-medium'
                                            }`}
                                    >
                                        {session.duration}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-medium ${session.status === "Concluída"
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
                            <TableCell colSpan={3} className="font-medium text-muted-foreground">
                                Total de sessões
                            </TableCell>
                            <TableCell className="text-right font-bold text-foreground">
                                {totalSessions}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DialogContent>
    )
}