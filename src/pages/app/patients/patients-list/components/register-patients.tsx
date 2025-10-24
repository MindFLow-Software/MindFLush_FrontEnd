"use client"

<<<<<<< HEAD
=======
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CloudDownload } from "lucide-react"

>>>>>>> 48e48e94ddc9e9b285ce9110d36c4b6bebac978f
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
<<<<<<< HEAD
import { CloudDownload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import z from "zod"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState<string | undefined>()
  const [role, setRole] = useState("PATIENT")
  const [isActive, setIsActive] = useState("true")
  const [profileImageUrl, setProfileImageUrl] = useState("")

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-lg sm:text-xl">Novo Paciente</DialogTitle>
        <DialogDescription className="text-sm">Preencha os dados para cadastrar um novo paciente</DialogDescription>
      </DialogHeader>

      <form className="space-y-3 sm:space-y-4 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm">
              Primeiro Nome
            </Label>
            <Input
              id="firstName"
              className="w-full"
              placeholder="Ex: Mariana"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm">
              Último Nome
            </Label>
            <Input
              id="lastName"
              className="w-full"
              placeholder="Ex: Silva"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpf" className="text-sm">
              CPF
            </Label>
            <Input
              id="cpf"
              className="w-full"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="birthDate" className="text-sm">
              Data de Nascimento
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left text-sm bg-transparent">
                  {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-sm">
              Telefone
            </Label>
            <Input
              id="phoneNumber"
              className="w-full"
              placeholder="(11) 99999-9999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
              maxLength={15}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="w-full"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="password" className="text-sm">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="w-full"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gender" className="text-sm">
              Gênero
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMININE">Feminino</SelectItem>
                <SelectItem value="MASCULINE">Masculino</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm">
              Perfil
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PATIENT">Paciente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="isActive" className="text-sm">
              Ativo?
            </Label>
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profileImageUrl" className="text-sm">
            URL da Foto
          </Label>
          <Input
            id="profileImageUrl"
            type="url"
            className="w-full"
            placeholder="https://exemplo.com/foto.jpg"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Empty className="border border-accent-foreground">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CloudDownload className="w-8 h-8 sm:w-10 sm:h-10" />
              </EmptyMedia>
              <EmptyTitle className="text-sm sm:text-base">Sem Documentos</EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm px-2">
                Faça o upload dos documentos do paciente para acessá-los facilmente.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" className="cursor-pointer text-sm bg-transparent" size="sm">
                Upload de Documentos
              </Button>
            </EmptyContent>
          </Empty>
        </div>

        <div className="pt-3 sm:pt-4">
          <Button type="submit" className="w-full cursor-pointer text-sm sm:text-base h-10 sm:h-11">
            Cadastrar paciente
          </Button>
        </div>
      </form>
    </DialogContent>
  )
=======
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { formatCEP } from "@/utils/formatCEP"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { registerPatients, type RegisterPatientsBody } from "@/api/register-patients"

export function RegisterPatients() {
    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [cep, setCep] = useState("")
    const [gender, setGender] = useState("FEMININE")
    const [role, setRole] = useState("PATIENT")
    const [isActive, setIsActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const form = e.currentTarget
            const formData = new FormData(form)

            const data: RegisterPatientsBody = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string | undefined,
                password: formData.get("password") as string,
                phoneNumber: phone,
                profileImageUrl: formData.get("profileImageUrl") as string | undefined,
                dateOfBirth: date!,
                cpf,
                role: role as any,
                gender: gender as any,
                isActive,
                expertise: "NONE" as any, // ajustar conforme necessidade
            }

            await registerPatients(data)
            alert("Paciente cadastrado com sucesso!")
            form.reset()
            setCpf("")
            setPhone("")
            setCep("")
            setDate(undefined)
            setGender("FEMININE")
            setRole("PATIENT")
            setIsActive(true)
        } catch (err: any) {
            setError(err?.response?.data?.message || "Erro ao cadastrar paciente")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Novo Paciente</DialogTitle>
                <DialogDescription>Preencha os dados para cadastrar um novo paciente</DialogDescription>
            </DialogHeader>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Primeiro Nome</Label>
                            <Input id="firstName" name="firstName" placeholder="Ex: Mariana" maxLength={30} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Último Nome</Label>
                            <Input id="lastName" name="lastName" placeholder="Ex: Silva" maxLength={50} />
                        </div>

                        {/* CPF */}
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(formatCPF(e.target.value))}
                                maxLength={14}
                                name="cpf"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Telefone */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefone</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                                maxLength={15}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="exemplo@email.com" />
                        </div>

                        {/* CEP */}
                        <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                                id="cep"
                                name="cep"
                                placeholder="00000-000"
                                value={cep}
                                onChange={(e) => setCep(formatCEP(e.target.value))}
                                maxLength={9}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} maxLength={30} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                    {/* Gênero */}
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger>
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
                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PATIENT">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ativo */}
                    <div className="space-y-2">
                        <Label htmlFor="isActive">Ativo?</Label>
                        <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* URL da Foto */}
                <div className="space-y-2">
                    <Label htmlFor="profileImageUrl">URL da Foto</Label>
                    <Input id="profileImageUrl" name="profileImageUrl" placeholder="https://exemplo.com/foto.jpg" />
                </div>

                {/* Upload */}
                <div>
                    <Empty className="border border-dashed py-6">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload className="h-8 w-8" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                            <EmptyDescription className="text-sm">Faça o upload dos documentos do paciente</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" size="sm" type="button">
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>

                {/* Botão Cadastrar */}
                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar paciente"}
                    </Button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </DialogContent>
    )
>>>>>>> 48e48e94ddc9e9b285ce9110d36c4b6bebac978f
}
