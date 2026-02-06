"use client"

import { Users } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PatientsTableRow } from "./patients-table-row"
import { PatientsTableLoading } from "./loading"
import type { Patient } from "@/api/get-patients"

interface PatientsTableProps {
    patients: Patient[]
    isLoading: boolean
    perPage?: number
}

export function PatientsTable({ patients, isLoading, perPage = 10 }: PatientsTableProps) {
    const columnCount = 9

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Paciente</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">CPF</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Telefone</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Email</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Idade / Nasc.</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Gênero</TableHead>
                        <TableHead className="text-right pr-12.5 text-xs uppercase tracking-wider font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <PatientsTableLoading rows={perPage} />
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRow
                                key={patient.id}
                                patient={patient}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="p-4 rounded-full bg-muted">
                                        <Users className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm font-medium">Nenhum paciente cadastrado.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
