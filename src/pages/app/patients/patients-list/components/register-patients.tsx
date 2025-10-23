import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CloudDownload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import z from "zod"

export const registerPatientForm = z.object({
    firstName: z.string().min(1, "Primeiro nome é obrigatório"),
    lastName: z.string().min(1, "Último nome é obrigatório"),
    phoneNumber: z.string().min(1, "Telefone é obrigatório").max(15),
    email: z.string().email("Email inválido").optional(),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").optional(),
    dateOfBirth: z.date(),
    cpf: z.string().min(11, "CPF inválido").max(14),
    role: z.enum(["PATIENT"]),
    gender: z.enum(["MASCULINE", "FEMININE", "OTHER"]),
    isActive: z.boolean().optional(),
    profileImageUrl: z.string().url().optional(),
})

export function RegisterPatients() {
    const [date, setDate] = useState<Date | undefined>()

    return (
        <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Novo Paciente</DialogTitle>
                <DialogDescription>
                    Preencha os dados para cadastrar um novo paciente
                </DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div>
                        <Label htmlFor="firstName">Primeiro Nome</Label>
                        <Input id="firstName" className="mt-2" placeholder="Ex: Mariana" />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Último Nome</Label>
                        <Input id="lastName" className="mt-2" placeholder="Ex: Silva" />
                    </div>

                    <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" className="mt-2" placeholder="000.000.000-00" />
                    </div>

                    {/* Data de Nascimento */}
                    <div className="flex flex-col">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full justify-start text-left"
                                >
                                    {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm"
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber">Telefone</Label>
                        <Input
                            id="phoneNumber"
                            className="mt-2"
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            className="mt-2"
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            className="mt-2"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Gênero */}
                    <div className="flex flex-col items-center">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select >
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FEMININE">Feminino</SelectItem>
                                <SelectItem value="MASCULINE">Masculino</SelectItem>
                                <SelectItem value="OTHER">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Perfil */}
                    <div className="flex flex-col items-center">
                        <Label htmlFor="role">Perfil</Label>
                        <Select defaultValue="PATIENT">
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PATIENT">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ativo */}
                    <div className="flex flex-col items-center">
                        <Label htmlFor="isActive">Ativo?</Label>
                        <Select defaultValue="true">
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid-cols-1 sm:grid-cols-1 gap-4">
                    <Label htmlFor="profileImageUrl">URL da Foto</Label>
                    <Input
                        id="profileImageUrl"
                        className="mt-2"
                        placeholder="https://exemplo.com/foto.jpg"
                    />
                </div>

                <div>
                    <Empty className="border border-accent-foreground">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload />
                            </EmptyMedia>
                            <EmptyTitle>Sem Documentos</EmptyTitle>
                            <EmptyDescription>
                                Faça o upload dos documentos do paciente para acessá-los facilmente.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" className="cursor-pointer" size="sm">
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>

                {/* Botão Cadastrar */}
                <div className="pt-4">
                    <Button type="submit" className="w-full cursor-pointer">
                        Cadastrar paciente
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}
