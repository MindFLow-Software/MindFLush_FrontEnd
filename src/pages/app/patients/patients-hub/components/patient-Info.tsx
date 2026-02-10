"use client"

interface PatientInfoProps {
    patient: {
        email?: string | null
        phoneNumber?: string | null
        cpf?: string | null
    }
}

const formatCPF = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
}

const formatPhoneNumber = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
}

interface InfoFieldProps {
    label: string
    value: string
    isMono?: boolean
}

function InfoField({ label, value, isMono }: InfoFieldProps) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {label}
            </span>
            <p className={`text-sm font-medium ${isMono ? "font-mono" : ""}`}>
                {value}
            </p>
        </div>
    )
}

export function PatientInfo({ patient }: PatientInfoProps) {
    return (
        // 🟢 Removido AccordionItem, agora é uma div estática
        <div className="border rounded-xl px-4 bg-card shadow-sm">
            {/* 🟢 Cabeçalho fixo sem interação */}
            <div className="text-sm font-bold py-4 border-b mb-2">
                Informações do Paciente
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
                <InfoField
                    label="E-mail de Contato"
                    value={patient.email || "—"}
                />
                <InfoField
                    label="Telefone / WhatsApp"
                    value={formatPhoneNumber(patient.phoneNumber)}
                />
                <InfoField
                    label="CPF"
                    value={formatCPF(patient.cpf)}
                    isMono
                />
            </div>
        </div>
    )
}