"use client"

import type { Appointment, AppointmentStatus } from "@/api/get-appointment"
import { TableCell, TableRow } from "@/components/ui/table"
// ATUALIZADO: Importe os tipos que definimos no seu arquivo de API
// (Ajuste o caminho se for diferente)

interface AppointmentProps {
    // ATUALIZADO: A prop agora é do tipo Appointment completo
    appointment: Appointment
}

// ATUALIZADO: A função agora usa o tipo AppointmentStatus e tem os casos corretos
function traduzirStatus(status: AppointmentStatus): {
    texto: string
    estilo: string
} {
    switch (status) {
        case "SCHEDULED":
            return { texto: "Agendado", estilo: "bg-blue-100 text-blue-700" }
        case "ATTENDING": // Era "IN_PROGRESS"
            return { texto: "Em andamento", estilo: "bg-yellow-100 text-yellow-700" }
        case "FINISHED": // Era "COMPLETED"
            return { texto: "Concluído", estilo: "bg-green-100 text-green-700" }
        case "CANCELED":
            return { texto: "Cancelado", estilo: "bg-red-100 text-red-700" }
        case "NOT_ATTEND": // Novo
            return {
                texto: "Não compareceu",
                estilo: "bg-orange-100 text-orange-700",
            }
        case "RESCHEDULED": // Novo
            return { texto: "Remarcado", estilo: "bg-purple-100 text-purple-700" }
        default:
            return { texto: "Desconhecido", estilo: "bg-gray-100 text-gray-700" }
    }
}

export function AppointmentsTableRow({ appointment }: AppointmentProps) {
    // ATUALIZADO: Desestruturamos 'patient' e pegamos o nome completo
    const { patient, diagnosis, notes, scheduledAt, status } = appointment
    const { texto, estilo } = traduzirStatus(status)

    const patientName = `${patient.firstName} ${patient.lastName}`

    return (
        <TableRow>
            {/* ATUALIZADO: Exibindo o nome do paciente */}
            <TableCell className="font-medium">{patientName}</TableCell>

            <TableCell className="text-muted-foreground">{diagnosis}</TableCell>
            <TableCell className="text-muted-foreground">{notes || "—"}</TableCell>
            <TableCell className="text-muted-foreground">
                {new Date(scheduledAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </TableCell>
            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${estilo}`}
                >
                    {texto}
                </span>
            </TableCell>
            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${estilo}`}
                >
                    {texto}
                </span>
            </TableCell>
        </TableRow>
    )
}