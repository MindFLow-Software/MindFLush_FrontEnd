"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudDownload } from "lucide-react"
import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLabel,
    FieldLegend,
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field"

// Certifique-se de que estes imports estejam corretos no seu projeto
// import { formatCPF } from "@/utils/formatCPF" 
// import { formatPhone } from "@/utils/formatPhone" 
import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"
import type { Gender } from "@/types/enum-gender" 
// Adicione o tipo Role se for diferente de Gender
type Role = "PATIENT" | "ADMIN" | "DOCTOR" 

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

// Funções formatCPF e formatPhone (colocadas aqui para o exemplo, mas devem vir de utils)
function formatCPF(raw: string): string {
    if (!raw) return raw
    const cleaned = String(raw).replace(/\D/g, '')
    if (/^\d{11}$/.test(cleaned)) {
        return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    }
    return cleaned
}

function formatPhone(raw: string): string {
    if (!raw) return raw
    const cleaned = String(raw).replace(/\D/g, '')
    if (/^(\d{2})(\d{5})(\d{4})$/.test(cleaned)) {
        return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
    if (/^(\d{2})(\d{4})(\d{4})$/.test(cleaned)) {
        return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }
    return cleaned
}


export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()
    const formRef = useRef<HTMLFormElement>(null)

    const getInitialDate = useCallback(() => patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined, [patient.dateOfBirth])
    const getInitialCpf = useCallback(() => patient.cpf ? formatCPF(patient.cpf) : "", [patient.cpf])
    const getInitialPhone = useCallback(() => patient.phoneNumber ? formatPhone(patient.phoneNumber) : "", [patient.phoneNumber])

    const [date, setDate] = useState<Date | undefined>(getInitialDate)
    const [cpf, setCpf] = useState(getInitialCpf)
    const [phone, setPhone] = useState(getInitialPhone)
    const [gender, setGender] = useState<Gender | "">(patient.gender ?? "")
    
    const [role, setRole] = useState<Role | "">(patient.role as Role ?? "PATIENT") // As
    const [isActive, setIsActive] = useState(patient.isActive ?? true) // Assumindo 'true' como padrão
    
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (Object.keys(errors).length > 0 && formRef.current) {
            const firstErrorElement = formRef.current.querySelector('.border-red-500')
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
        }
    }, [errors])

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            toast.success("Paciente atualizado com sucesso!")
            onClose?.()
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || "Erro ao atualizar paciente. Verifique os dados."
            toast.error(errorMessage)
        },
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({})

        const formData = new FormData(e.currentTarget)

        const rawCpf = cpf.replace(/\D/g, "")
        const rawPhone = phone.replace(/\D/g, "")

        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const profileImageUrl = formData.get("profileImageUrl") as string

        const newErrors: FormErrors = {}

        if (!firstName) newErrors.firstName = true
        if (!lastName) newErrors.lastName = true
        if (!email) newErrors.email = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length !== 11) newErrors.cpf = true
        if (rawPhone.length < 10 || rawPhone.length > 11) newErrors.phoneNumber = true
        if (password && password.length < 6) newErrors.password = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Preencha corretamente os campos destacados.")
            return
        }

        const data: UpdatePatientData = {
            id: patient.id,
            firstName,
            lastName,
            email,
            password: password || undefined,
            phoneNumber: rawPhone,
            dateOfBirth: date,
            cpf: rawCpf,
            gender: gender || undefined,
            profileImageUrl: profileImageUrl || undefined,
            role: role as any,
            isActive: isActive,
        }

        await updatePatientFn(data)
    }

    return (
        <DialogContent className="max-w-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogDescription>
                    Atualize as informações do paciente **{patient.firstName} {patient.lastName}**.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col flex-1 min-h-0">

                <FieldGroup className="mt-4 flex-1 pb-4">

                    <FieldSet>
                        <FieldGroup>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Nome */}
                                <Field>
                                    <FieldLabel htmlFor="firstName">Primeiro Nome*</FieldLabel>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        defaultValue={patient.firstName}
                                        maxLength={30}
                                        className={cn(errors.firstName && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                {/* Sobrenome */}
                                <Field>
                                    <FieldLabel htmlFor="lastName">Último Nome*</FieldLabel>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        defaultValue={patient.lastName}
                                        maxLength={50}
                                        className={cn(errors.lastName && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                {/* CPF */}
                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF*</FieldLabel>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                                        maxLength={14}
                                        className={cn(errors.cpf && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                {/* Data de Nascimento */}
                                <Field>
                                    <FieldLabel>Data de Nascimento*</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-between bg-transparent font-normal",
                                                    errors.dateOfBirth && "border-red-500 text-red-500 hover:text-red-500 hover:border-red-500"
                                                )}
                                            >
                                                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={date}
                                                onSelect={setDate}
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>

                                {/* Telefone */}
                                <Field>
                                    <FieldLabel htmlFor="phoneNumber">Telefone*</FieldLabel>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        maxLength={15}
                                        className={cn(errors.phoneNumber && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                {/* Email */}
                                <Field>
                                    <FieldLabel htmlFor="email">Email*</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={patient.email}
                                        className={cn(errors.email && "border-red-500 ring-red-500")}
                                    />
                                </Field>
                            </div>

                            {/* Senha */}
                            <Field>
                                <FieldLabel htmlFor="password">Senha</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Preencha para alterar (Mínimo 6 caracteres)"
                                    minLength={6}
                                    maxLength={30}
                                    className={cn(errors.password && "border-red-500 ring-red-500")}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* CONFIGURAÇÕES DO PERFIL (GÊNERO, PERFIL, ATIVO) */}
                    <FieldSet>
                        <FieldLegend>Configurações do Perfil</FieldLegend>
                        <FieldDescription>Informações internas do sistema</FieldDescription>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            {/* Gênero */}
                            <Field>
                                <FieldLabel>Gênero</FieldLabel>
                                <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEMININE">Feminino</SelectItem>
                                        <SelectItem value="MASCULINE">Masculino</SelectItem>
                                        <SelectItem value="OTHER">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* Perfil (Role) */}
                            <Field>
                                <FieldLabel>Perfil</FieldLabel>
                                <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        {/* Assumindo que o paciente pode ser alterado para outros perfis se necessário */}
                                        <SelectItem value="PATIENT">Paciente</SelectItem>
                                        {/* Adicionar outros SelectItem conforme os tipos de Role, se houver */}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* Ativo? (isActive) */}
                            <Field>
                                <FieldLabel>Ativo?</FieldLabel>
                                <Select 
                                    value={isActive ? "true" : "false"} 
                                    onValueChange={(v) => setIsActive(v === "true")}
                                >
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Sim</SelectItem>
                                        <SelectItem value="false">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Foto */}
                    <FieldSet>
                        <FieldLegend>Foto</FieldLegend>
                        <Field>
                            <FieldLabel htmlFor="profileImageUrl">URL da Foto</FieldLabel>
                            <Input
                                id="profileImageUrl"
                                name="profileImageUrl"
                                defaultValue={patient.profileImageUrl}
                                placeholder="https://exemplo.com/foto.jpg"
                            />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Documentos */}
                    <FieldSet>
                        <FieldLegend>Documentos</FieldLegend>
                        <FieldDescription>Arquivos enviados pelo paciente</FieldDescription>

                        <Empty className="border border-dashed py-6">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CloudDownload className="h-8 w-8" />
                                </EmptyMedia>
                                <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                                <EmptyDescription className="text-sm">Faça o upload dos documentos do paciente</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button variant="outline" size="sm" type="button">Upload de Documentos</Button>
                            </EmptyContent>
                        </Empty>
                    </FieldSet>

                </FieldGroup>

                <div className="p-0 border-t pt-4">
                    <Field orientation="horizontal">
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Atualizando..." : "Atualizar paciente"}
                        </Button>
                    </Field>
                </div>
            </form>
        </DialogContent>
    )
}