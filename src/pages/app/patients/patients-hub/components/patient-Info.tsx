"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, XCircle } from "lucide-react" // 🟢 Ícones idênticos à tabela
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/api/get-patients"

interface PatientInfoProps {
    patient: Patient & { totalAppointments?: number }
}

const formatCPF = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
}

const formatPhoneNumber = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return "—"
    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) return "—"

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return `${age} anos`
}

interface InfoFieldProps {
    label: string
    value: React.ReactNode // 🟢 Alterado para aceitar componentes como o Badge
    isMono?: boolean
}

function InfoField({ label, value, isMono }: InfoFieldProps) {
    return (
        <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {label}
            </span>
            <div className={cn(
                "text-sm font-medium flex items-center min-h-[22px]",
                isMono && "font-mono tabular-nums"
            )}>
                {value}
            </div>
        </div>
    )
}

export function PatientInfo({ patient }: PatientInfoProps) {
    const isPatientActive = patient.isActive

    const age = calculateAge(patient.dateOfBirth)
    const dobFormatted = patient.dateOfBirth
        ? format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
        : "—"

    return (
        <div className="border rounded-xl px-4 bg-card shadow-sm">
            {/* Cabeçalho da Seção */}
            <div className="text-sm font-bold py-4 border-b mb-2 flex justify-between items-center">
                <span>Informações de Cadastro</span>

                {/* 🟢 Badge de Status Superior (Mesmo padrão da tabela) */}
                {isPatientActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Paciente Ativo
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <XCircle className="h-3 w-3" aria-hidden="true" /> Paciente Inativo
                    </Badge>
                )}
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8 py-4">
                <InfoField label="Idade" value={age} />
                <InfoField label="Nascimento" value={dobFormatted} isMono />
                <InfoField label="CPF" value={formatCPF(patient.cpf)} isMono />
                <InfoField label="Telefone / WhatsApp" value={formatPhoneNumber(patient.phoneNumber)} isMono />
                <InfoField label="E-mail de Contato" value={patient.email || "—"} />
                <InfoField label="Total de Atendimentos" value={patient.totalAppointments ?? 0} isMono />

                {/* 🟢 Status do Prontuário dentro da Grid (Mesmo padrão da tabela) */}
                <InfoField
                    label="Status do Prontuário"
                    value={
                        isPatientActive ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Ativo
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                                <XCircle className="h-3 w-3" aria-hidden="true" /> Inativo
                            </Badge>
                        )
                    }
                />
            </div>
        </div>
    )
}